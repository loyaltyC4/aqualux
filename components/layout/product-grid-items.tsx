import { ProductCard } from "components/product-card";
import { Product } from "lib/shopify/types";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <li key={product.handle}>
          <ProductCard
            product={product}
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
          />
        </li>
      ))}
    </>
  );
}
