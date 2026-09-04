import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': any;
    }
  }
}

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'dotlottie-player': any;
    }
  }
}

export {};
