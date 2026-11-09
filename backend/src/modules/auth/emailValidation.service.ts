/** @format */

// 1. API configuration
const ABSTRACT_API_URL = 'https://emailreputation.abstractapi.com/v1/';
const REQUEST_TIMEOUT_MS = 5000;

// 2. Define possible errors from the API integration
type ProviderErrorReason = 'MISSING_API_KEY' | 'HTTP_ERROR' | 'INVALID_RESPONSE' | 'REQUEST_FAILED';

// 3. Custom error class for handling provider-related errors
export class EmailValidationProviderError extends Error {
  constructor(
    public readonly reason: ProviderErrorReason,
    public readonly statusCode?: number,
  ) {
    super(`Email validation provider error: ${reason}`);
    this.name = 'EmailValidationProviderError';
  }
}

// 4. Define the expected API response structure
type AbstractApiResponse = {
  email_quality?: {
    is_disposable?: unknown;
  };
};

// 5. Check whether an email address is disposable
export const checkDisposableEmail = async (email: string): Promise<boolean> => {
  // 5.1 Get API key from environment variables
  const apiKey = process.env.ABSTRACT_API_KEY;

  if (!apiKey?.trim()) {
    throw new EmailValidationProviderError('MISSING_API_KEY');
  }

  // 5.2 Build API request URL with required parameters
  const url = new URL(ABSTRACT_API_URL);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('email', email);

  // 5.3 Send request to Abstract API with a 5-second timeout
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new EmailValidationProviderError('REQUEST_FAILED');
  }

  // 5.4 Check whether the API request was successful
  if (!response.ok) {
    throw new EmailValidationProviderError('HTTP_ERROR', response.status);
  }

  // 5.5 Parse the API response
  let result: AbstractApiResponse;

  try {
    result = (await response.json()) as AbstractApiResponse;
  } catch {
    throw new EmailValidationProviderError('INVALID_RESPONSE');
  }

  // 5.6 Extract and validate the disposable email status
  const isDisposable = result?.email_quality?.is_disposable;

  if (typeof isDisposable !== 'boolean') {
    throw new EmailValidationProviderError('INVALID_RESPONSE');
  }

  // 5.7 Return the disposable status
  return isDisposable;
};
