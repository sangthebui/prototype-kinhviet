const operators = `

// Viet Ngu có cả phép toán một ngôi và hai ngôi.
//
//     Toán hai ngôi yêu cầu hai toán hạng, một toán hạng trước toán tử và một toán hạng sau toán tử:
//
//     toán hạng toán tử toán hạng
//     Ví dụ: 3 + 4 hoặc x * y.
//
//     Phép toán một ngôi cẩn 1 toán hạng, trước hoặc sau toán tử:
//
//     toán tử toán hạng hoặc toán hạng toán tử 
//     Ví dụ:  x++ or ++x.
//
//     Khi xâu chuỗi các biểu thức này mà không có dấu ngoặc đơn hoặc các toán tử nhóm khác như ký tự mảng, 
//     các biểu thức phân công được gôp lại và tính từ phải sang trái (chúng có tính chất liên kết phải), 
//     nhưng nếu phép tính thông thường thì được tính từ trái sang phải.
//
// 5 + 10 * 2; // 25
//
// (5 + 10) * 2; // 30
//
// Toán tử so sánh 
//
// 3 == var1; // cân bằng
//
// var1 != 4; // không cân bằng 
//
// var2 > var1; // lớn hơn
//
// var2 >= var1; // lớn hơn hoặc bằng
//
// var2 < var1; // bé hơn
//
// var2 <= var1; // bé hơn hoặc bằng
//
// +,-,/, *; cộng, trừ, chia, nhân
//
// a++; // tăng
// a--; // giảm
//
// chuỗi + chuỗi; // nối chuỗi

bien a = 20 + 10;
bien b = 20;
bien c = 2;

viet(a + b * c); // 50
viet((a+b) *c); // 60
viet(a++); // 11
viet(a--); // 10


`;


export default operators;