import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/counting_provider.dart';

class PartAutocompleteField extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode? focusNode;
  final String hintText;
  final String? labelText;
  final TextStyle? style;
  final InputBorder? border;
  final Function(String selectedItem, String detectedUnit) onSelected;
  final ValueChanged<String>? onChanged;

  const PartAutocompleteField({
    super.key,
    required this.controller,
    this.focusNode,
    this.hintText = 'পণ্যের নাম লিখুন (যেমন: Axio হাবস)...',
    this.labelText,
    this.style,
    this.border,
    required this.onSelected,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return RawAutocomplete<String>(
      textEditingController: controller,
      focusNode: focusNode ?? FocusNode(),
      optionsBuilder: (TextEditingValue textEditingValue) {
        if (textEditingValue.text.trim().isEmpty) {
          return const Iterable<String>.empty();
        }
        return context
            .read<CountingProvider>()
            .getSuggestions(textEditingValue.text);
      },
      onSelected: (String selection) {
        final detected =
            context.read<CountingProvider>().detectUnit(selection);
        onSelected(selection, detected);
      },
      fieldViewBuilder: (context, textController, fieldFocusNode, onSubmitted) {
        return TextField(
          controller: textController,
          focusNode: fieldFocusNode,
          style: style ??
              const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
          decoration: InputDecoration(
            border: border ?? InputBorder.none,
            labelText: labelText,
            labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            hintText: hintText,
            hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
            isDense: true,
          ),
          onChanged: onChanged,
        );
      },
      optionsViewBuilder: (context, selectCallback, options) {
        return Align(
          alignment: Alignment.topLeft,
          child: Material(
            elevation: 8,
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(10),
            child: Container(
              width: 280,
              constraints: const BoxConstraints(maxHeight: 220),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF0284C7)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x660284C7),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 4),
                itemCount: options.length,
                shrinkWrap: true,
                itemBuilder: (BuildContext context, int index) {
                  final String option = options.elementAt(index);
                  return ListTile(
                    dense: true,
                    visualDensity: VisualDensity.compact,
                    title: Text(
                      option,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    leading: const Icon(Icons.search,
                        size: 14, color: Color(0xFF38BDF8)),
                    trailing: Text(
                      context.read<CountingProvider>().detectUnit(option),
                      style: const TextStyle(
                        color: Color(0xFF10B981),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    onTap: () => selectCallback(option),
                  );
                },
              ),
            ),
          ),
        );
      },
    );
  }
}
