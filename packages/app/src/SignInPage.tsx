import { Title } from '@mantine/core';
import { Logo, SignInForm, useMedplumProfile } from '@medplum/react';
import { JSX, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getConfig, isRegisterEnabled } from './config';

export function SignInPage(): JSX.Element {
  const profile = useMedplumProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const config = getConfig();

  const navigateToNext = useCallback(() => {
    // only redirect to next if it is a pathname to avoid redirecting
    // to a maliciously crafted URL, e.g. /signin?next=https%3A%2F%2Fevil.com
    const nextUrl = searchParams.get('next');
    navigate(nextUrl?.startsWith('/') ? nextUrl : '/')?.catch(console.error);
  }, [searchParams, navigate]);

  useEffect(() => {
    // Redirect to add default project ID if none is specified
    if (!searchParams.has('project') && config.defaultProjectId) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('project', config.defaultProjectId);
      
      // Preserve any other query parameters like 'next'
      const nextParam = searchParams.get('next');
      if (nextParam) {
        newParams.set('next', nextParam);
      }
      
      navigate({ pathname: '/signin', search: newParams.toString() }, { replace: true })?.catch(console.error);
      return;
    }

    if (profile && searchParams.has('next')) {
      navigateToNext();
    }
  }, [profile, searchParams, navigate, navigateToNext, config.defaultProjectId]);

  return (
    <SignInForm
      onSuccess={() => navigateToNext()}
      onForgotPassword={() => navigate('/resetpassword')?.catch(console.error)}
      onRegister={isRegisterEnabled() ? () => navigate('/register')?.catch(console.error) : undefined}
      googleClientId={config.googleClientId}
      login={searchParams.get('login') || undefined}
      projectId={searchParams.get('project') || undefined}
    >
      <Logo size={32} />
      <Title>Sign in to Medplum</Title>
      {searchParams.get('project') === 'new' && <div>Sign in again to create a new project</div>}
    </SignInForm>
  );
}
