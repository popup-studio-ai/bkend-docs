class ApiConstants {
  ApiConstants._();

  static const bool mockMode = bool.fromEnvironment(
    'MOCK_MODE',
    defaultValue: true,
  );

  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api-client.bkend.ai',
  );

  static const String publishableKey = String.fromEnvironment(
    'PUBLISHABLE_KEY',
    defaultValue: '',
  );

  // Auth
  static const String signUp = '/v1/auth/email/signup';
  static const String signIn = '/v1/auth/email/signin';
  static const String refresh = '/v1/auth/refresh';
  static const String me = '/v1/auth/me';

  // Data
  static String dataTable(String tableName) => '/v1/data/$tableName';
  static String dataRecord(String tableName, String id) =>
      '/v1/data/$tableName/$id';

  // Files
  static const String presignedUrl = '/v1/files/presigned-url';
}
