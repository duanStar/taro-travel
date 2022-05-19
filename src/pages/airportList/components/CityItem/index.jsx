import { PureComponent } from 'react';
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import Taro from '@tarojs/taro';

import './index.scss'

class CityItem extends PureComponent {
  onCityClick(cityInfo) {
    const { cityType } = this.props
    const { cityId, cityName, airportName } = cityInfo
    this.props.dispatch({
      type: 'flightIndex/updateState',
      payload: cityType === 'depart' ?  {
        dptCityId: cityId,
        dptAirportName: airportName,
        dptCityName: cityName
      } : {
        arrCityId: cityId,
        arrAirportName: airportName,
        arrCityName: cityName
      }
    })
    Taro.navigateBack()
  }

  render() {
    const { cityList, label } = this.props
    return (
      <View className="list-item" id={label}>
        <Text className="label">{label}</Text>
        {
          cityList?.map(item => (<View key={item.id} className="name" onClick={() => this.onCityClick(item)}>{`${item.cityName} (${item.airportName})`}</View>))
        }
      </View>
    );
  }
}
export default connect(({ flightIndex }) => {
  return {
    ...flightIndex
  }
})(CityItem);
