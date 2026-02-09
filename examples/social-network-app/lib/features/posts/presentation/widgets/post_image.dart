import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class PostImage extends StatelessWidget {
  final String imageUrl;
  final String heroTag;
  final double? height;
  final BorderRadius? borderRadius;
  final VoidCallback? onTap;

  const PostImage({
    super.key,
    required this.imageUrl,
    required this.heroTag,
    this.height,
    this.borderRadius,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Hero(
      tag: heroTag,
      child: GestureDetector(
        onTap: onTap,
        child: ClipRRect(
          borderRadius: borderRadius ?? BorderRadius.circular(12),
          child: CachedNetworkImage(
            imageUrl: imageUrl,
            height: height,
            width: double.infinity,
            fit: BoxFit.cover,
            placeholder: (context, url) => Shimmer.fromColors(
              baseColor:
                  isDark ? const Color(0xFF2D2D44) : const Color(0xFFE0E0E0),
              highlightColor:
                  isDark ? const Color(0xFF3D3D54) : const Color(0xFFF5F5F5),
              child: Container(
                height: height ?? 200,
                color: Colors.white,
              ),
            ),
            errorWidget: (context, url, error) => Container(
              height: height ?? 200,
              color: isDark ? const Color(0xFF2D2D44) : const Color(0xFFE0E0E0),
              child: const Center(
                child: Icon(Icons.broken_image_outlined, size: 48),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
