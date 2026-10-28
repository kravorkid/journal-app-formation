import axios from 'axios'

const MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou mot de passe incorrect.',
  invalid_input: 'Les informations saisies sont invalides.',
  account_exists: 'Un compte existe déjà avec cet e-mail.',
  rate_limited: 'Trop de tentatives, réessayez plus tard.',
  email_confirmation_enabled: "La confirmation d'e-mail est activée sur le serveur.",
  unauthenticated: 'Votre session a expiré.',
  invalid_refresh_token: 'Votre session a expiré.',
  entry_not_found: "Cette entrée n'existe plus.",
  payload_too_large: 'La photo est trop volumineuse.',
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Impossible de joindre le serveur.'
    const code = (error.response.data as { error?: string } | undefined)?.error
    return (code && MESSAGES[code]) || 'Une erreur est survenue.'
  }
  return error instanceof Error ? error.message : 'Une erreur est survenue.'
}
