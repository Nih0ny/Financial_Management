import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import { CategoryService } from 'src/category/category.service';
import { ChatCompletionContentPart } from 'openai/resources/chat';
import { ResponseFormatJSONSchema } from 'openai/resources/shared';

@Injectable()
export class OpenAiService {
  constructor(private readonly categoryService: CategoryService) {}

  async parseReceiptFromImage(base64Image: string): Promise<any> {
    const openaiClient = new OpenAI();

    const messages: ChatCompletionContentPart[] = [
      { type: 'text', text: 'Parse details from the receipt' },
      {
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${base64Image}` },
      },
    ];

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: messages }],
      response_format: await this.getJsonSchema(),
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    return JSON.parse(content);
  }

  private async getJsonSchema(): Promise<ResponseFormatJSONSchema> {
    return {
      type: 'json_schema',
      json_schema: {
        name: 'Receipt',
        schema: {
          type: 'object',
          properties: {
            receipt: {
              type: 'object',
              properties: {
                merchant: { type: 'string' },
                total: {
                  type: 'number',
                  description: 'Purchase with 2 decimal places',
                },
                category: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      enum: await this.categoryService.findAllInArray(),
                      describe:
                        'From the given array, choose the category that best fits this receipt',
                    },
                  },
                  required: ['name'],
                  additionalProperties: false,
                },
                paymentType: {
                  type: 'string',
                  enum: ['card', 'cash', 'other'],
                  description: `If payment type is missing, write 'other'`,
                },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      product: {
                        type: 'string',
                        description: 'Product name, save native language',
                      },
                      amount: {
                        type: 'number',
                        description:
                          'Integer subunit, if the amount is missing write 1.',
                      },
                      price: {
                        type: 'number',
                        description: 'Product price with 2 decimal places',
                      },
                    },
                    required: ['product', 'amount', 'price'],
                    additionalProperties: false,
                  },
                },
                date: {
                  type: 'string',
                  description: 'Purchase date in YYYY-MM-DDTHH:MM:SSZ format',
                },
              },
              required: [
                'category',
                'merchant',
                'date',
                'paymentType',
                'total',
                'items',
              ],
              additionalProperties: false,
            },
            error: {
              type: ['string', 'null'],
              description: "When can't parse receipt",
            },
          },
          additionalProperties: false,
          required: ['receipt', 'error'],
        },
        strict: true,
      },
    };
  }
}
