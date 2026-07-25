import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile, UserProfileData } from './api';

export const USER_PROFILE_QUERY_KEY = ['userProfile'];

export const useUserProfile = () => {
  return useQuery<UserProfileData, Error>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
};
