import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../../shared/utils/format_utils.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class RecipeFormScreen extends StatefulWidget {
  final String? recipeId;

  const RecipeFormScreen({super.key, this.recipeId});

  @override
  State<RecipeFormScreen> createState() => _RecipeFormScreenState();
}

class _RecipeFormScreenState extends State<RecipeFormScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  bool _isSubmitting = false;
  bool _isUploadingImage = false;
  String? _imageUrl;
  bool get _isEditing => widget.recipeId != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final provider = context.read<RecipeProvider>();
        provider.loadRecipe(widget.recipeId!);
      });
    }
  }

  Future<void> _pickAndUploadImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1200,
      maxHeight: 1200,
      imageQuality: 85,
    );
    if (image == null) return;

    setState(() {
      _isUploadingImage = true;
    });

    try {
      final bytes = await image.readAsBytes();
      final provider = context.read<RecipeProvider>();
      final url = await provider.uploadImage(
        filename: image.name,
        contentType: 'image/jpeg',
        imageBytes: bytes,
      );
      if (url != null) {
        setState(() {
          _imageUrl = url;
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to upload image.')),
          );
        }
      }
    } finally {
      setState(() {
        _isUploadingImage = false;
      });
    }
  }

  Future<void> _onSubmit() async {
    if (!(_formKey.currentState?.saveAndValidate() ?? false)) return;

    setState(() {
      _isSubmitting = true;
    });

    final values = _formKey.currentState!.value;
    final provider = context.read<RecipeProvider>();

    try {
      if (_isEditing) {
        final updates = <String, dynamic>{
          'title': values['title'],
          'description': values['description'] ?? '',
          'cookingTime': int.tryParse(values['cookingTime'] ?? '0') ?? 0,
          'difficulty': values['difficulty'],
          'servings': int.tryParse(values['servings'] ?? '1') ?? 1,
          'category': values['category'],
          if (_imageUrl != null) 'imageUrl': _imageUrl,
        };
        final result =
            await provider.updateRecipe(widget.recipeId!, updates);
        if (result != null && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Recipe has been updated.')),
          );
          context.pop();
        }
      } else {
        final recipe = Recipe(
          id: '',
          title: values['title'] as String,
          description: (values['description'] as String?) ?? '',
          cookingTime:
              int.tryParse(values['cookingTime'] as String? ?? '0') ?? 0,
          difficulty: values['difficulty'] as String,
          servings:
              int.tryParse(values['servings'] as String? ?? '1') ?? 1,
          category: values['category'] as String,
          imageUrl: _imageUrl,
          createdBy: '',
          createdAt: '',
          updatedAt: '',
        );
        final result = await provider.createRecipe(recipe);
        if (result != null && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Recipe has been created.')),
          );
          context.pop();
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Recipe' : 'New Recipe'),
      ),
      body: Consumer<RecipeProvider>(
        builder: (context, provider, _) {
          final existingRecipe =
              _isEditing ? provider.selectedRecipe : null;

          if (_isEditing && provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_isEditing && existingRecipe != null && _imageUrl == null) {
            _imageUrl = existingRecipe.imageUrl;
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: FormBuilder(
              key: _formKey,
              initialValue: _isEditing && existingRecipe != null
                  ? {
                      'title': existingRecipe.title,
                      'description': existingRecipe.description,
                      'cookingTime':
                          existingRecipe.cookingTime.toString(),
                      'difficulty': existingRecipe.difficulty,
                      'servings': existingRecipe.servings.toString(),
                      'category': existingRecipe.category,
                    }
                  : {
                      'difficulty': 'easy',
                      'servings': '2',
                      'cookingTime': '30',
                    },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image upload
                  GestureDetector(
                    onTap: _isUploadingImage ? null : _pickAndUploadImage,
                    child: Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.outline.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: theme.colorScheme.outline.withOpacity(0.3),
                          style: BorderStyle.solid,
                        ),
                        image: _imageUrl != null
                            ? DecorationImage(
                                image: NetworkImage(_imageUrl!),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: _isUploadingImage
                          ? const Center(
                              child: CircularProgressIndicator(
                                  strokeWidth: 2),
                            )
                          : _imageUrl == null
                              ? Column(
                                  mainAxisAlignment:
                                      MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.add_photo_alternate_outlined,
                                      size: 48,
                                      color: theme.colorScheme.onSurfaceVariant
                                          .withOpacity(0.5),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Add Photo',
                                      style: theme.textTheme.bodyMedium
                                          ?.copyWith(
                                        color: theme
                                            .colorScheme.onSurfaceVariant
                                            .withOpacity(0.5),
                                      ),
                                    ),
                                  ],
                                )
                              : null,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Title
                  FormBuilderTextField(
                    name: 'title',
                    decoration: const InputDecoration(
                      labelText: 'Recipe Name',
                      hintText: 'e.g. Kimchi Jjigae',
                    ),
                    validator: FormBuilderValidators.required(
                        errorText: 'Please enter a recipe name.'),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  FormBuilderTextField(
                    name: 'description',
                    decoration: const InputDecoration(
                      labelText: 'Description',
                      hintText: 'A brief description of the recipe',
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),

                  // Category
                  FormBuilderDropdown<String>(
                    name: 'category',
                    decoration: const InputDecoration(
                      labelText: 'Category',
                    ),
                    validator: FormBuilderValidators.required(
                        errorText: 'Please select a category.'),
                    items: Recipe.categories
                        .map((c) => DropdownMenuItem(
                              value: c,
                              child: Text(c),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 16),

                  // Difficulty
                  Text(
                    'Difficulty',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  FormBuilderChoiceChips<String>(
                    name: 'difficulty',
                    spacing: 8,
                    validator: FormBuilderValidators.required(
                        errorText: 'Please select a difficulty.'),
                    options: Recipe.difficulties
                        .map((d) => FormBuilderChipOption(
                              value: d,
                              child: Text(FormatUtils.difficultyLabel(d)),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 16),

                  // Cooking time + Servings
                  Row(
                    children: [
                      Expanded(
                        child: FormBuilderTextField(
                          name: 'cookingTime',
                          decoration: const InputDecoration(
                            labelText: 'Cooking Time (min)',
                            hintText: '30',
                          ),
                          keyboardType: TextInputType.number,
                          validator: FormBuilderValidators.compose([
                            FormBuilderValidators.required(
                                errorText: 'Required field.'),
                            FormBuilderValidators.numeric(
                                errorText: 'Please enter a number.'),
                          ]),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: FormBuilderTextField(
                          name: 'servings',
                          decoration: const InputDecoration(
                            labelText: 'Servings',
                            hintText: '2',
                          ),
                          keyboardType: TextInputType.number,
                          validator: FormBuilderValidators.compose([
                            FormBuilderValidators.required(
                                errorText: 'Required field.'),
                            FormBuilderValidators.numeric(
                                errorText: 'Please enter a number.'),
                          ]),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Save button
                  FilledButton(
                    onPressed: _isSubmitting ? null : _onSubmit,
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text(_isEditing ? 'Save Changes' : 'Create Recipe'),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
