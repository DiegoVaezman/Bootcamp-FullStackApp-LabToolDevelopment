import productListCNB from '../services/productListCNB'
import apiURL from '../services/apiURL'
import axios from 'axios';
console.log(productListCNB)


// for (var i=0; i < productListCNB.length; i++) {

//     var catalogNumber = parseInt(productListCNB[i].catalog_number)
//     var priceNumber = parseFloat(productListCNB[i].price)
//     productListCNB[i].catalog_number = catalogNumber
//     productListCNB[i].price = priceNumber
//     console.log(productListCNB[i])
// }


// for (var i=0; i <= productListCNB.length; i++) {

//     axios.post(`${apiURL}product/newproduct`, productListCNB[i])
//     .then(res => {
//         console.log(res.data)
//     })
//     .catch(error => {
//         console.log(error.response)
//     });
// }