import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../profiles/providers/profile_provider.dart';
import '../providers/auth_provider.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  bool _obscurePassword = true;

  Future<void> _handleSignIn() async {
    if (!(_formKey.currentState?.saveAndValidate() ?? false)) return;

    final values = _formKey.currentState!.value;

    final authProvider = context.read<AuthProvider>();

    final success = await authProvider.signIn(
      email: values['email'] as String,
      password: values['password'] as String,
    );

    if (success && mounted) {
      await _ensureProfile();
      if (mounted) context.go('/feed');
    }
  }

  Future<void> _handleGoogleSignIn() async {
    final authProvider = context.read<AuthProvider>();

    final success = await authProvider.signInWithGoogle();

    if (success && mounted) {
      await _ensureProfile();
      if (mounted) context.go('/feed');
    }
  }

  Future<void> _ensureProfile() async {
    final auth = context.read<AuthProvider>();
    if (auth.currentUserId == null) return;
    await context.read<ProfileProvider>().ensureProfile(
          userId: auth.currentUserId!,
          name: auth.user?.name,
          email: auth.user?.email,
        );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: FormBuilder(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(
                    Icons.people_alt_rounded,
                    size: 64,
                    color: theme.colorScheme.primary,
                  )
                      .animate()
                      .fadeIn(duration: 600.ms)
                      .scale(begin: const Offset(0.5, 0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'Social Network',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.primary,
                    ),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to connect with friends',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 300.ms, duration: 600.ms),
                  const SizedBox(height: 48),
                  FormBuilderTextField(
                    name: 'email',
                    initialValue: 'demo@bkend.ai',
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      hintText: 'example@email.com',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    validator: FormBuilderValidators.compose([
                      FormBuilderValidators.required(
                          errorText: 'Please enter your email.'),
                      FormBuilderValidators.email(
                          errorText: 'Please enter a valid email address.'),
                    ]),
                  ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.1),
                  const SizedBox(height: 16),
                  FormBuilderTextField(
                    name: 'password',
                    initialValue: 'Bkend123\$',
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: 'Enter your password',
                      prefixIcon: const Icon(Icons.lock_outlined),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    obscureText: _obscurePassword,
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _handleSignIn(),
                    validator: FormBuilderValidators.required(
                        errorText: 'Please enter your password.'),
                  ).animate().fadeIn(delay: 500.ms).slideX(begin: -0.1),
                  const SizedBox(height: 8),
                  Consumer<AuthProvider>(
                    builder: (context, auth, _) {
                      if (auth.error != null &&
                          auth.status == AuthStatus.error) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Text(
                            auth.error!,
                            style: TextStyle(
                              color: theme.colorScheme.error,
                              fontSize: 14,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        );
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  const SizedBox(height: 16),
                  Consumer<AuthProvider>(
                    builder: (context, auth, _) {
                      final isLoading = auth.status == AuthStatus.loading;
                      return FilledButton(
                        onPressed: isLoading ? null : _handleSignIn,
                        child: isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text('Sign In'),
                      );
                    },
                  ).animate().fadeIn(delay: 600.ms),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      const Expanded(child: Divider()),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'or',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider()),
                    ],
                  ).animate().fadeIn(delay: 650.ms),
                  const SizedBox(height: 20),
                  Consumer<AuthProvider>(
                    builder: (context, auth, _) {
                      final isLoading = auth.status == AuthStatus.loading;
                      return OutlinedButton.icon(
                        onPressed: isLoading ? null : _handleGoogleSignIn,
                        icon: const _GoogleIcon(),
                        label: const Text('Continue with Google'),
                      );
                    },
                  ).animate().fadeIn(delay: 700.ms),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Don\'t have an account?',
                        style: theme.textTheme.bodyMedium,
                      ),
                      TextButton(
                        onPressed: () => context.push('/sign-up'),
                        child: const Text('Sign Up'),
                      ),
                    ],
                  ).animate().fadeIn(delay: 750.ms),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _GoogleIcon extends StatelessWidget {
  const _GoogleIcon();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 20,
      height: 20,
      child: CustomPaint(painter: _GoogleLogoPainter()),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // Blue
    final bluePaint = Paint()..color = const Color(0xFF4285F4);
    canvas.drawPath(
      Path()
        ..moveTo(w * 0.94, h * 0.51)
        ..cubicTo(w * 0.94, h * 0.475, w * 0.937, h * 0.443, w * 0.93, h * 0.417)
        ..lineTo(w * 0.5, h * 0.417)
        ..lineTo(w * 0.5, h * 0.594)
        ..lineTo(w * 0.747, h * 0.594)
        ..cubicTo(w * 0.735, h * 0.663, w * 0.697, h * 0.72, w * 0.638, h * 0.758)
        ..lineTo(w * 0.787, h * 0.873)
        ..cubicTo(w * 0.874, h * 0.793, w * 0.94, h * 0.676, w * 0.94, h * 0.51),
      bluePaint,
    );

    // Green
    final greenPaint = Paint()..color = const Color(0xFF34A853);
    canvas.drawPath(
      Path()
        ..moveTo(w * 0.5, h * 0.958)
        ..cubicTo(w * 0.624, h * 0.958, w * 0.728, h * 0.917, w * 0.787, h * 0.873)
        ..lineTo(w * 0.638, h * 0.758)
        ..cubicTo(w * 0.597, h * 0.785, w * 0.543, h * 0.802, w * 0.5, h * 0.802)
        ..cubicTo(w * 0.381, h * 0.802, w * 0.28, h * 0.722, w * 0.243, h * 0.613)
        ..lineTo(w * 0.091, h * 0.732)
        ..cubicTo(w * 0.166, h * 0.855, w * 0.321, h * 0.958, w * 0.5, h * 0.958),
      greenPaint,
    );

    // Yellow
    final yellowPaint = Paint()..color = const Color(0xFFFBBC05);
    canvas.drawPath(
      Path()
        ..moveTo(w * 0.243, h * 0.587)
        ..cubicTo(w * 0.234, h * 0.56, w * 0.229, h * 0.53, w * 0.229, h * 0.5)
        ..cubicTo(w * 0.229, h * 0.47, w * 0.234, h * 0.44, w * 0.243, h * 0.413)
        ..lineTo(w * 0.091, h * 0.295)
        ..cubicTo(w * 0.06, h * 0.356, w * 0.042, h * 0.426, w * 0.042, h * 0.5)
        ..cubicTo(w * 0.042, h * 0.574, w * 0.06, h * 0.644, w * 0.091, h * 0.705)
        ..lineTo(w * 0.243, h * 0.587),
      yellowPaint,
    );

    // Red
    final redPaint = Paint()..color = const Color(0xFFEA4335);
    canvas.drawPath(
      Path()
        ..moveTo(w * 0.5, h * 0.224)
        ..cubicTo(w * 0.567, h * 0.224, w * 0.627, h * 0.247, w * 0.675, h * 0.292)
        ..lineTo(w * 0.807, h * 0.161)
        ..cubicTo(w * 0.727, h * 0.087, w * 0.624, h * 0.042, w * 0.5, h * 0.042)
        ..cubicTo(w * 0.321, h * 0.042, w * 0.166, h * 0.145, w * 0.091, h * 0.295)
        ..lineTo(w * 0.243, h * 0.413)
        ..cubicTo(w * 0.28, h * 0.305, w * 0.381, h * 0.224, w * 0.5, h * 0.224),
      redPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
