import tools from '@/common/tools';
import { PureComponent } from 'react';

const IsLogin = (WrappedComponent) => {
  return class extends PureComponent {
    componentDidMount() {
      const userInfo = tools.getStorageSyncWithTime('userInfo')
      if (!userInfo) {
        tools.navigateTo({
          url: '/pages/login/index'
        })
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default IsLogin;
