const Function = {
  type(obj) {
    let typeMap = {
      '[object Object]': 'Object',
      '[object Array]': 'Array',
      '[object Number]': 'Number',
      '[object Function]': 'Function',
      '[object Date]': 'Date',
      '[object RegExp]': 'RegExp',
      '[object Undefined]': 'Undefined',
      '[object Null]': 'Null',
      '[object Boolean]': 'Boolean',
      '[object String]': 'String'
    };
    if (obj instanceof Element) {
      return 'Element'
    }
    return typeMap[Object.prototype.toString.call(obj)]
  },
  deepCopy(data) {
    let t = this.type(data);
    let newData;
    if (t === 'Array') {
      newData = [];
      data.map((item) => {
        newData.push(this.deepCopy(item))
      });
      return newData
    }
    if (t === 'Object') {
      newData = {};
      for (let key in data) {
        newData[key] = this.deepCopy(data[key])
      }
      return newData
    } else {
      return data
    }
  },
  // 下载二进制文件
  downloadHandler: function (res, fileName) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(res);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
    if (navigator.userAgent.indexOf('Firefox') > -1) {
      const a = document.createElement('a');
      a.addEventListener('click', function (e) {
        a.download = fileName;
        a.href = URL.createObjectURL(res)
      });
      let e = document.createEvent('MouseEvents');
      e.initEvent('click', false, false);
      a.dispatchEvent(e)
    }
  },
  dateFormat(time, format) {
    let zeroFill = function (num) {
      return num < 10 ? '0' + num : num
    }
    let formatStr = format || 'YYYY年MM月DD日';
    // Safari 上转换2017-04-08 11:39:00.0(多个.0)Invalid Date
    let date = new Date(time);
    let year = date.getFullYear();
    let month = zeroFill(date.getMonth() + 1);
    let day = zeroFill(date.getDate());
    let hour = zeroFill(date.getHours());
    let minute = zeroFill(date.getMinutes());
    let second = zeroFill(date.getSeconds());
    const formatArr = ['YYYY', 'MM', 'DD', 'H', 'M', 'S'];
    const dateArr = [year, month, day, hour, minute, second];
    for (let i = 0; i < formatArr.length; i++) {
      formatStr = formatStr.replace(formatArr[i], dateArr[i])
    }
    return formatStr
  },
  // configList维表数据, code维表对应code, 返回维表对应name
  getConfigName(configList, code) {
    let mapList = configList.map(item => [item.code, item.name]);
    let nameMap = new Map(mapList);
    return nameMap.get(code)
  },

  /**
   * 存储localStorage
   */
  setStore (name, content)  {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  },

  /**
   * 获取localStorage
   */
  getStore (name) {
    if (!name) return;
    return window.localStorage.getItem(name);
  },

  /**
   * 删除localStorage
   */
  removeStore (name) {
    if (!name) return;
    window.localStorage.removeItem(name);
  }

};

export default Function
