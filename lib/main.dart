import 'package:flutter/material.dart';

void main() => runApp(const UdharApp());

const _blue = Color(0xFF108CF4);
const _ink = Color(0xFF102957);
const _muted = Color(0xFF7890B6);
const _border = Color(0xFFDCEBFC);

class Product {
  const Product(this.name, this.category, this.price, this.emoji);
  final String name;
  final String category;
  final int price;
  final String emoji;
}

const _products = [
  Product('Sugar', 'Grocery', 180, '🍚'),
  Product('Flour', 'Grocery', 120, '🥣'),
  Product('Rice', 'Grocery', 160, '🍚'),
  Product('Cooking Oil', 'Oil & Ghee', 450, '🫗'),
  Product('Ghee', 'Oil & Ghee', 850, '🫙'),
  Product('Tea', 'Drinks', 320, '🍵'),
  Product('Lentils', 'Grocery', 220, '🫘'),
  Product('Spices', 'Grocery', 180, '🌶️'),
  Product('Biscuits', 'Drinks', 100, '🍪'),
  Product('Milk', 'Dairy', 120, '🥛'),
  Product('Eggs', 'Dairy', 300, '🥚'),
  Product('Vegetables', 'Grocery', 80, '🥬'),
];

class UdharApp extends StatelessWidget {
  const UdharApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Udhar Sale',
        theme: ThemeData(
          useMaterial3: true,
          fontFamily: 'Roboto',
          scaffoldBackgroundColor: const Color(0xFFF7FBFF),
          colorScheme: ColorScheme.fromSeed(seedColor: _blue),
        ),
        home: const NewSalePage(),
      );
}

class NewSalePage extends StatefulWidget {
  const NewSalePage({super.key});
  @override
  State<NewSalePage> createState() => _NewSalePageState();
}

class _NewSalePageState extends State<NewSalePage> {
  final Set<String> _cart = {'Sugar', 'Ghee'};
  int get total => _products.where((p) => _cart.contains(p.name)).fold(0, (n, p) => n + p.price);
  void add(Product product) => setState(() => _cart.add(product.name));

  @override
  Widget build(BuildContext context) => Scaffold(
        bottomNavigationBar: const AppNavigation(),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 20),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Header(title: 'New Sale', left: Icons.arrow_back, right: Icons.edit_outlined),
              const SizedBox(height: 28),
              const CustomerCard(),
              const SizedBox(height: 16),
              const TotalCard(),
              const SizedBox(height: 22),
              _AddItems(onAdd: add),
              const SizedBox(height: 20),
              CartSummary(count: _cart.length),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 60,
                child: ElevatedButton.icon(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sale saved successfully'))),
                  icon: const Icon(Icons.save_outlined),
                  label: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Save Sale'), Text('Rs. $total')]),
                  style: ElevatedButton.styleFrom(backgroundColor: _blue, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                ),
              ),
            ]),
          ),
        ),
      );
}

class _AddItems extends StatefulWidget {
  const _AddItems({required this.onAdd});
  final ValueChanged<Product> onAdd;
  @override
  State<_AddItems> createState() => _AddItemsState();
}

class _AddItemsState extends State<_AddItems> {
  String query = '';
  String category = 'All';
  @override
  Widget build(BuildContext context) {
    final shown = _products.where((p) => (category == 'All' || p.category == category) && p.name.toLowerCase().contains(query.toLowerCase())).toList();
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [const Text('Add Items', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: _ink)), const Spacer(), TextButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsPage())), child: const Text('View All  ›'))]),
      const SizedBox(height: 6),
      SearchBox(onChanged: (v) => setState(() => query = v)),
      const SizedBox(height: 14),
      CategoryChips(selected: category, onSelected: (v) => setState(() => category = v)),
      const SizedBox(height: 16),
      GridView.builder(physics: const NeverScrollableScrollPhysics(), shrinkWrap: true, itemCount: shown.length, gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, childAspectRatio: .76, crossAxisSpacing: 9, mainAxisSpacing: 9), itemBuilder: (_, i) => ProductTile(product: shown[i], onAdd: () => widget.onAdd(shown[i]))),
    ]);
  }
}

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key});
  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  String query = '';
  String category = 'All';
  final Set<String> added = {};
  @override
  Widget build(BuildContext context) {
    final shown = _products.where((p) => (category == 'All' || p.category == category) && p.name.toLowerCase().contains(query.toLowerCase())).toList();
    return Scaffold(bottomNavigationBar: const AppNavigation(), body: SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(18, 16, 18, 0), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Header(title: 'Products', left: Icons.arrow_back, right: Icons.search, onLeft: () => Navigator.pop(context)),
      const SizedBox(height: 28), SearchBox(onChanged: (v) => setState(() => query = v)), const SizedBox(height: 14),
      CategoryChips(selected: category, onSelected: (v) => setState(() => category = v)), const SizedBox(height: 34),
      const SectionTitle(icon: Icons.bolt_outlined, title: 'Frequently Added'), const SizedBox(height: 16),
      SizedBox(height: 102, child: ListView.separated(scrollDirection: Axis.horizontal, itemCount: 5, separatorBuilder: (_, __) => const SizedBox(width: 9), itemBuilder: (_, i) => QuickProduct(product: _products[i]))),
      const SizedBox(height: 34), const Text('All Products', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: _ink)), const SizedBox(height: 18),
      Expanded(child: ListView.separated(itemCount: shown.length, separatorBuilder: (_, __) => const SizedBox(height: 8), itemBuilder: (_, i) => ProductRow(product: shown[i], added: added.contains(shown[i].name), onAdd: () => setState(() => added.add(shown[i].name))))),
    ]))));
  }
}

class Header extends StatelessWidget { const Header({super.key, required this.title, required this.left, required this.right, this.onLeft}); final String title; final IconData left, right; final VoidCallback? onLeft; @override Widget build(BuildContext context) => Row(children: [IconButton(onPressed: onLeft ?? () {}, icon: Icon(left, color: _ink)), Expanded(child: Center(child: Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: _ink)))), IconButton(onPressed: () {}, icon: Icon(right, color: _blue))]); }
class CustomerCard extends StatelessWidget { const CustomerCard({super.key}); @override Widget build(BuildContext context) => _paleCard(Row(children: [const CircleAvatar(radius: 30, backgroundColor: Color(0xFFE7F3FF), child: Icon(Icons.person, color: _blue, size: 38)), const SizedBox(width: 16), const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Muhammad Ali', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: _ink)), SizedBox(height: 5), Text('0300 1234567', style: TextStyle(color: _muted, fontSize: 15))]), const Spacer(), const Icon(Icons.chevron_right, color: _blue)])); }
class TotalCard extends StatelessWidget { const TotalCard({super.key}); @override Widget build(BuildContext context) => _paleCard(Row(children: [const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Total Udhar', style: TextStyle(fontWeight: FontWeight.w600, color: _muted, fontSize: 16)), SizedBox(height: 5), Text('Rs. 180', style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFFE53935), fontSize: 32))]), const Spacer(), const Icon(Icons.account_balance_wallet_outlined, color: _blue, size: 32)])); }
Widget _paleCard(Widget child) => Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: const Color(0xFFEFF7FF), borderRadius: BorderRadius.circular(16)), child: child);

class SearchBox extends StatelessWidget { const SearchBox({super.key, required this.onChanged}); final ValueChanged<String> onChanged; @override Widget build(BuildContext context) => TextField(onChanged: onChanged, decoration: InputDecoration(hintText: 'Search product...', hintStyle: const TextStyle(color: _muted), prefixIcon: const Icon(Icons.search, color: _muted), filled: true, fillColor: Colors.white, contentPadding: const EdgeInsets.symmetric(vertical: 16), border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _border)), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _border)))); }
class CategoryChips extends StatelessWidget { const CategoryChips({super.key, required this.selected, required this.onSelected}); final String selected; final ValueChanged<String> onSelected; @override Widget build(BuildContext context) => SizedBox(height: 44, child: ListView.separated(scrollDirection: Axis.horizontal, itemCount: 5, separatorBuilder: (_, __) => const SizedBox(width: 8), itemBuilder: (_, i) { const names = ['All', 'Grocery', 'Dairy', 'Oil & Ghee', 'Drinks']; final active = names[i] == selected; return ChoiceChip(label: Text(names[i]), selected: active, onSelected: (_) => onSelected(names[i]), selectedColor: _blue, labelStyle: TextStyle(color: active ? Colors.white : const Color(0xFF647A9F), fontWeight: FontWeight.w600), side: const BorderSide(color: _border), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22))); })); }
class ProductTile extends StatelessWidget { const ProductTile({super.key, required this.product, required this.onAdd}); final Product product; final VoidCallback onAdd; @override Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15), border: Border.all(color: _border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(child: Center(child: Text(product.emoji, style: const TextStyle(fontSize: 48)))), Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, color: _ink)), const SizedBox(height: 3), Row(children: [Text('Rs. ${product.price}', style: const TextStyle(color: _muted, fontSize: 13)), const Spacer(), AddButton(onPressed: onAdd, small: true)]) ])); }
class ProductRow extends StatelessWidget { const ProductRow({super.key, required this.product, required this.added, required this.onAdd}); final Product product; final bool added; final VoidCallback onAdd; @override Widget build(BuildContext context) => Container(height: 96, padding: const EdgeInsets.symmetric(horizontal: 16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15)), child: Row(children: [Text(product.emoji, style: const TextStyle(fontSize: 47)), const SizedBox(width: 18), Expanded(child: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [Text(product.name, style: const TextStyle(fontWeight: FontWeight.w700, color: _ink, fontSize: 16)), Text(product.category, style: const TextStyle(color: _muted)), Text('Rs. ${product.price}', style: const TextStyle(color: _blue, fontWeight: FontWeight.w700, fontSize: 16))])), AddButton(onPressed: onAdd, added: added)]) ); }
class AddButton extends StatelessWidget { const AddButton({super.key, required this.onPressed, this.small = false, this.added = false}); final VoidCallback onPressed; final bool small, added; @override Widget build(BuildContext context) => SizedBox(width: small ? 22 : 36, height: small ? 22 : 36, child: FilledButton(onPressed: onPressed, style: FilledButton.styleFrom(padding: EdgeInsets.zero, backgroundColor: added ? const Color(0xFF65B6FA) : _blue, shape: const CircleBorder()), child: Icon(added ? Icons.check : Icons.add, size: small ? 16 : 23))); }
class QuickProduct extends StatelessWidget { const QuickProduct({super.key, required this.product}); final Product product; @override Widget build(BuildContext context) => Container(width: 82, padding: const EdgeInsets.all(7), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(13), border: Border.all(color: _border)), child: Column(children: [Expanded(child: Text(product.emoji, style: const TextStyle(fontSize: 39))), Text(product.name, style: const TextStyle(fontSize: 12, color: _ink))])); }
class SectionTitle extends StatelessWidget { const SectionTitle({super.key, required this.icon, required this.title}); final IconData icon; final String title; @override Widget build(BuildContext context) => Row(children: [Icon(icon, color: _blue, size: 27), const SizedBox(width: 9), Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: _ink))]); }
class CartSummary extends StatelessWidget { const CartSummary({super.key, required this.count}); final int count; @override Widget build(BuildContext context) => _paleCard(Row(children: [const Icon(Icons.receipt_long_outlined, color: _blue, size: 31), const SizedBox(width: 18), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('$count items added', style: const TextStyle(fontWeight: FontWeight.w700, color: _ink)), const SizedBox(height: 3), const Text('Sugar (1) • Ghee (1)', style: TextStyle(color: _muted))]), const Spacer(), const Icon(Icons.chevron_right, color: _muted)])); }
class AppNavigation extends StatelessWidget { const AppNavigation({super.key}); @override Widget build(BuildContext context) => NavigationBar(selectedIndex: 2, onDestinationSelected: (i) { if (i == 2) Navigator.push(context, MaterialPageRoute(builder: (_) => const ProductsPage())); }, destinations: const [NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'), NavigationDestination(icon: Icon(Icons.menu_book_outlined), label: 'Khata'), NavigationDestination(icon: Icon(Icons.shopping_basket_outlined), label: 'Products'), NavigationDestination(icon: Icon(Icons.bar_chart_outlined), label: 'Reports'), NavigationDestination(icon: Icon(Icons.more_horiz), label: 'More')]); }
