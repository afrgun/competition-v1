// Type declarations for remoteLogin Module Federation remote

declare module 'remoteLogin/webcomponent' {
  const component: any;
  export default component;
}

declare module 'remoteLogin/LoginForm' {
  const component: any;
  export default component;
}

// Custom element type for angular-login Web Component
declare namespace JSX {
  interface IntrinsicElements {
    'angular-login': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        onLoginSubmit?: (event: CustomEvent<{ email: string; password: string }>) => void;
        onSuccess?: (event: CustomEvent<any>) => void;
        onError?: (event: CustomEvent<any>) => void;
      },
      HTMLElement
    >;
  }
}
