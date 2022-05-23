const withShare = (opts) => {
  return (WrapComponent) => {
    class MyComponent extends WrapComponent {
      onShareAppMessage() {
        return {
          ...opts,
          path: `/${this.props.tid}`,
        };
      }
    }
    return MyComponent;
  };
};

export default withShare;
