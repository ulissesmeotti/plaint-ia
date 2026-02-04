import { supabase } from './supabaseClient';
import { PlantAnalysis, UserState, MAX_FREE_CREDITS } from '../types';

export const userService = {
  /**
   * Fetch the user's profile. If it doesn't exist, create it.
   */
  async getOrCreateProfile(user: any): Promise<UserState> {
    try {
      // 1. Try to get profile to check premium status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch warning (might not exist yet):', error.message);
      }

      // 2. Get existing analyses to calculate credits
      // If table doesn't exist or error, we default to empty array (0 usage)
      let analyses: PlantAnalysis[] = [];
      try {
          analyses = await this.getAnalyses(user.id);
      } catch (e) {
          console.warn("Could not fetch analyses (table might be missing), defaulting to empty history.");
          analyses = [];
      }
      
      // Calculate credits based on history count
      const usedCredits = analyses.length;
      const calculatedCredits = Math.max(0, MAX_FREE_CREDITS - usedCredits);

      // 3. If profile exists, return state
      if (profile) {
        return {
          credits: calculatedCredits,
          isPremium: profile.is_premium ?? false,
          analyses: analyses
        };
      }

      // 4. If profile does not exist, create it
      const newProfile = {
        id: user.id,
        email: user.email,
        is_premium: false
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (insertError) {
        // Handle RLS Policy Violation (42501) or Race Condition (23505)
        // Code 42501 often means the user does not have permission to INSERT.
        // This is common if the backend relies on a Trigger to create profiles.
        // In this case, we suppress the error and act as a Free user.
        if (insertError.code === '42501' || insertError.code === '23505') {
            const { data: retryProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (retryProfile) {
                return {
                    credits: calculatedCredits,
                    isPremium: retryProfile.is_premium ?? false,
                    analyses: analyses
                };
            }
            
            // If we still can't find it (likely latency in trigger or RLS blocking select on creation),
            // just return default free state. This prevents the app from breaking.
            console.warn("Could not create/fetch profile due to RLS or Trigger. Using default Free tier state.");
            return {
                credits: calculatedCredits,
                isPremium: false,
                analyses: analyses
            };
        }
        
        console.error('Error creating profile:', JSON.stringify(insertError));
      }

      return {
        credits: calculatedCredits, 
        isPremium: false,
        analyses: analyses
      };

    } catch (err: any) {
      console.error('UserService Error:', err.message || JSON.stringify(err));
      // Fallback to ensure UI doesn't crash
      return {
        credits: MAX_FREE_CREDITS,
        isPremium: false,
        analyses: []
      };
    }
  },

  async getAnalyses(userId: string): Promise<PlantAnalysis[]> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      // If table 'analyses' does not exist (Postgres code 42P01), we treat it as empty list so app doesn't break
      if (error.code === '42P01') {
          console.warn("Table 'analyses' does not exist yet. Please create it in Supabase.");
          return [];
      }
      console.error('Error fetching analyses:', JSON.stringify(error));
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id.toString(),
      imageUrl: item.image_url || 'https://via.placeholder.com/300?text=No+Image', 
      rawText: item.raw_text,
      timestamp: new Date(item.created_at).getTime()
    }));
  },

  async saveAnalysis(userId: string, rawText: string, imageUrl: string): Promise<void> {
    const { error } = await supabase
      .from('analyses')
      .insert([{
        user_id: userId,
        raw_text: rawText,
        image_url: imageUrl 
      }]);

    if (error) {
        console.error('Error saving analysis:', JSON.stringify(error));
        // Throw specific error for UI to display
        if (error.code === '42P01') {
             throw new Error("Erro: A tabela de histórico não existe no banco de dados.");
        }
        if (error.code === '23503') {
             // Foreign Key Violation - User doesn't exist in 'profiles' table usually
             throw new Error("Erro de integridade: Perfil de usuário não encontrado no banco de dados.");
        }
        throw new Error("Erro ao salvar a análise no histórico.");
    }
  },

  async upgradeToPremium(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', userId);

    if (error) console.error('Error upgrading profile:', JSON.stringify(error));
  }
};