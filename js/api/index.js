
  let baseUrl='http://101.132.108.33:8000'

  export function GET(url, params) {
    return new Promise((resolve, reject) => {
      if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
      }
      fetch(`${baseUrl}${url}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err))

    })
  }

  // post方式
  export function POST(url, data) {
    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err))

    })
  }


  //put 修改
  export function PUT(url, data) {
    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err))

    })
  }

  //delete
  export function DELETE(url, data) {
    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => resolve('数据删除成功!'))
        .catch(err => reject(err))
    })
  }
