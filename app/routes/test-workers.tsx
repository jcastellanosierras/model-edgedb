import product from '../data/product.json'

export async function loader () {
  const url = 'http://localhost:46061'
  try {
      try {
        console.time('Productos subidos')
        for (let i = 0; i < 1000; i++) {
          await fetch(url, {  
          method: 'POST',
            body: JSON.stringify(product)
          })
        }
        console.timeEnd('Productos subidos')
      } catch (e) {
        const error = e as Error
        console.log(error.message)
      }
  } catch (e) {
    const error = e as Error
    console.log(error.message)
  }

  return null
}