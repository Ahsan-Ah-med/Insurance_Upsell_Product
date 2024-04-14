import type {
  RunInput,
  FunctionRunResult,
  ProductVariant,
  PriceAdjustment,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  // console.log("testing2");
  let cartTotal: number = 0;
  let percentValue;
  for (const line of input?.cart?.lines) {
    // Assuming each line has a price and quantity property
    let itemPrice: number = 0;
    let percentValueMeta;
    if (!(line.merchandise as ProductVariant).product.hasTags[0].hasTag) {
      itemPrice = line?.cost?.amountPerQuantity?.amount * line?.quantity;
    }
    if ((line.merchandise as ProductVariant).product.hasTags[0].hasTag && (line.merchandise as ProductVariant)?.product?.metafield) {
      percentValueMeta = (line.merchandise as ProductVariant)?.product?.metafield?.value;
    }
    cartTotal += itemPrice;
    percentValue = percentValueMeta;
  }
  console.log(cartTotal.toFixed(2));
  console.log(percentValue);
  const finalCartTotal = cartTotal / 100 * 10;
  // const finalCartTotal2 = (cartTotal / 100) * Number(percentValue);
  // console.log(finalCartTotal2)
  

  const operations = input.cart.lines.map((cartLine) => {
    // console.log("testing1");
    return {
      update: {
        cartLineId: cartLine.id,
        title: (cartLine.merchandise as ProductVariant).product.title,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: (cartLine?.merchandise as ProductVariant)?.product
                ?.hasTags[0]?.hasTag
                ? finalCartTotal
                : cartLine.cost.amountPerQuantity.amount,
            },
          },
        },
      },
    };
  });

  return {
    operations,
  };
}
