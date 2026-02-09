import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ShimmerLoading extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerLoading({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shimmer.fromColors(
      baseColor: isDark ? const Color(0xFF2D2D44) : const Color(0xFFE0E0E0),
      highlightColor:
          isDark ? const Color(0xFF3D3D54) : const Color(0xFFF5F5F5),
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

class PostCardShimmer extends StatelessWidget {
  const PostCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const ShimmerLoading(width: 40, height: 40, borderRadius: 20),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  ShimmerLoading(width: 120, height: 14),
                  SizedBox(height: 4),
                  ShimmerLoading(width: 80, height: 12),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          const ShimmerLoading(height: 16),
          const SizedBox(height: 6),
          const ShimmerLoading(width: 200, height: 16),
          const SizedBox(height: 12),
          const ShimmerLoading(height: 200, borderRadius: 12),
          const SizedBox(height: 12),
          Row(
            children: const [
              ShimmerLoading(width: 60, height: 14),
              SizedBox(width: 16),
              ShimmerLoading(width: 60, height: 14),
            ],
          ),
        ],
      ),
    );
  }
}

class ProfileShimmer extends StatelessWidget {
  const ProfileShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          const ShimmerLoading(width: 80, height: 80, borderRadius: 40),
          const SizedBox(height: 16),
          const ShimmerLoading(width: 140, height: 20),
          const SizedBox(height: 8),
          const ShimmerLoading(width: 200, height: 14),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              ShimmerLoading(width: 60, height: 36),
              SizedBox(width: 24),
              ShimmerLoading(width: 60, height: 36),
              SizedBox(width: 24),
              ShimmerLoading(width: 60, height: 36),
            ],
          ),
        ],
      ),
    );
  }
}
