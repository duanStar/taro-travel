import { PureComponent } from 'react';
import { View, Text } from '@tarojs/components'

import './index.scss'

class CityItem extends PureComponent {
  render() {
    const { cityList, label } = this.props
    return (
      <View className="list-item" id={label}>
        <Text className="label">{label}</Text>
        {
          cityList?.map(item => (<View key={item.id} className="name">{`${item.cityName} (${item.airportName})`}</View>))
        }
      </View>
    );
  }
}
export default CityItem;
