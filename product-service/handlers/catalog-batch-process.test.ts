jest.mock('../services/products', () => {
  createProduct: jest.fn().mockImplementation(async (data) => data)
});

import {handler} from "./catalog-batch-process";
import {SQSRecord} from "aws-lambda";
import {createProduct} from "../services/products";

const product = {
  "name": "Title 8",
  "description": "Description 8",
  "category": "hoodi",
  "size": "XL",
  "color": "blue",
  "gender": "M",
  "price": "100",
  "count": "2"
};

describe('batch creation', () => {
  it('creates product for every valid SQS record', async () => {
    await handler({
      Records: [<SQSRecord>{ body: JSON.stringify(product)}],
    });

    expect(createProduct).lastCalledWith(product);
  });
});
