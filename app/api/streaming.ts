// // Custom implementation for StreamingTextResponse
// export class StreamingTextResponse extends Response {
//   constructor(
//     streamOrGenerator: ReadableStream | AsyncGenerator<any, any, any>
//   ) {
//     // Convert generator to stream if needed
//     const stream = isAsyncGenerator(streamOrGenerator)
//       ? streamFromGenerator(streamOrGenerator)
//       : streamOrGenerator;

//     super(stream, {
//       headers: {
//         'Content-Type': 'text/plain; charset=utf-8',
//         'Transfer-Encoding': 'chunked',
//         'X-Content-Type-Options': 'nosniff',
//       },
//     });
//   }
// }

// // Helper to check if value is an AsyncGenerator
// function isAsyncGenerator(
//   value: any
// ): value is AsyncGenerator<any, any, any> {
//   return (
//     value !== null &&
//     typeof value === 'object' &&
//     typeof value[Symbol.asyncIterator] === 'function'
//   );
// }

// // Convert AsyncGenerator to ReadableStream
// function streamFromGenerator(
//   generator: AsyncGenerator<any, any, any>
// ): ReadableStream {
//   return new ReadableStream({
//     async pull(controller) {
//       try {
//         const { value, done } = await generator.next();
        
//         if (done) {
//           controller.close();
//         } else {
//           // Handle Hugging Face's text generation output
//           const text = value.token?.text || value.generated_text || '';
//           if (text) {
//             const encoder = new TextEncoder();
//             controller.enqueue(encoder.encode(text));
//           }
//         }
//       } catch (error) {
//         controller.error(error);
//       }
//     },
//   });
// } 

// Define the expected shape of the generator output
type TextStreamChunk = {
  token?: { text?: string };
  generated_text?: string;
};

// Custom implementation for StreamingTextResponse
export class StreamingTextResponse extends Response {
  constructor(
    streamOrGenerator: ReadableStream | AsyncGenerator<TextStreamChunk, void, unknown>
  ) {
    const stream = isAsyncGenerator(streamOrGenerator)
      ? streamFromGenerator(streamOrGenerator)
      : streamOrGenerator;

    super(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}

// Helper to check if value is an AsyncGenerator
function isAsyncGenerator(
  value: unknown
): value is AsyncGenerator<TextStreamChunk, void, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Symbol.asyncIterator in value &&
    typeof (value as { [Symbol.asyncIterator]: unknown })[Symbol.asyncIterator] === 'function'
  );
}

// Convert AsyncGenerator to ReadableStream
function streamFromGenerator(
  generator: AsyncGenerator<TextStreamChunk, void, unknown>
): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await generator.next();
        
        if (done) {
          controller.close();
        } else {
          const text = value.token?.text || value.generated_text || '';
          if (text) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
