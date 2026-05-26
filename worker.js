import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let webllmEngine = null;

self.onmessage = async (event) => {
  const payload = event.data;

  if (payload.type === 'INITIALIZE_ENGINE') {
    try {
      webllmEngine = await CreateMLCEngine(payload.modelId, {
        initProgressCallback: (progress) => {
          self.postMessage({
            type: 'PROGRESS',
            text: progress.text,
            ratio: progress.progress
          });
        }
      });
      self.postMessage({ type: 'ENGINE_READY' });
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  }

  else if (payload.type === 'EXECUTE_INFERENCE') {
    if (!webllmEngine) {
      self.postMessage({ type: 'ERROR', error: 'Inference pipeline uninitialized.' });
      return;
    }
    try {
      const responseStream = await webllmEngine.chat.completions.create({
        messages: payload.messages,
        stream: true
      });

      for await (const incrementalChunk of responseStream) {
        const deltaText = incrementalChunk.choices[0]?.delta?.content || "";
        if (deltaText) {
          self.postMessage({
            type: 'TOKEN_STREAM',
            text: deltaText
          });
        }
      }
      self.postMessage({ type: 'STREAM_COMPLETE' });
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  }
};