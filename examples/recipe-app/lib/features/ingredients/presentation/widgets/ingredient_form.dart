import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:provider/provider.dart';
import '../../models/ingredient.dart';
import '../../providers/ingredient_provider.dart';

class IngredientForm extends StatefulWidget {
  final String recipeId;
  final Ingredient? ingredient;

  const IngredientForm({
    super.key,
    required this.recipeId,
    this.ingredient,
  });

  @override
  State<IngredientForm> createState() => _IngredientFormState();
}

class _IngredientFormState extends State<IngredientForm> {
  final _formKey = GlobalKey<FormBuilderState>();
  bool _isSubmitting = false;

  bool get _isEditing => widget.ingredient != null;

  Future<void> _onSubmit() async {
    if (!(_formKey.currentState?.saveAndValidate() ?? false)) return;

    setState(() {
      _isSubmitting = true;
    });

    final values = _formKey.currentState!.value;
    final provider = context.read<IngredientProvider>();

    try {
      bool success;
      if (_isEditing) {
        success = await provider.updateIngredient(
          widget.ingredient!.id,
          {
            'name': values['name'],
            'amount': values['amount'],
            'unit': values['unit'],
            'isOptional': values['isOptional'] ?? false,
          },
        );
      } else {
        success = await provider.addIngredient(
          recipeId: widget.recipeId,
          name: values['name'] as String,
          amount: values['amount'] as String,
          unit: values['unit'] as String,
          isOptional: values['isOptional'] as bool? ?? false,
        );
      }

      if (success && mounted) {
        Navigator.pop(context);
      } else if (!success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'An error occurred.'),
          ),
        );
        provider.clearError();
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

    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: FormBuilder(
        key: _formKey,
        initialValue: _isEditing
            ? {
                'name': widget.ingredient!.name,
                'amount': widget.ingredient!.amount,
                'unit': widget.ingredient!.unit,
                'isOptional': widget.ingredient!.isOptional,
              }
            : {
                'unit': 'g',
                'isOptional': false,
              },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _isEditing ? 'Edit Ingredient' : 'Add Ingredient',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 20),
            FormBuilderTextField(
              name: 'name',
              decoration: const InputDecoration(
                labelText: 'Ingredient Name',
                hintText: 'e.g. Pork belly',
              ),
              validator: FormBuilderValidators.required(
                  errorText: 'Please enter an ingredient name.'),
              autofocus: true,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: FormBuilderTextField(
                    name: 'amount',
                    decoration: const InputDecoration(
                      labelText: 'Amount',
                      hintText: '100',
                    ),
                    validator: FormBuilderValidators.required(
                        errorText: 'Required'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 3,
                  child: FormBuilderDropdown<String>(
                    name: 'unit',
                    decoration: const InputDecoration(
                      labelText: 'Unit',
                    ),
                    items: Ingredient.units
                        .map((u) => DropdownMenuItem(
                              value: u,
                              child: Text(u),
                            ))
                        .toList(),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            FormBuilderCheckbox(
              name: 'isOptional',
              title: Text(
                'Optional ingredient',
                style: theme.textTheme.bodyMedium,
              ),
              activeColor: theme.colorScheme.primary,
            ),
            const SizedBox(height: 20),
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
                  : Text(_isEditing ? 'Update' : 'Add'),
            ),
          ],
        ),
      ),
    );
  }
}
