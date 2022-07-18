const variables = `

// Việt Ngữ có thể phân biệt được chữ hoa và chữ thường, đồng thời sử dụng được bộ ký tự Unicode.
//     Nhưng, biến: "trái cây" không giống với "Trái Cây" vì Việt Ngữ phân biệt chữ hoa và chữ thường.
//
//     Dấu chấm phẩy là cần thiết sau mỗi câu lệnh, mỗi biểu thức, mỗi khai báo.
//
//     Cú pháp để viết chú thích giống như trong C ++ và trong nhiều ngôn ngữ khác: //
// 
//
//     bien - Khai báo một biến, tuy chọn gán với một giá trị nào đố.
//
//     Bạn sử dụng các biến làm tên tượng trưng cho các giá trị trong code của bạn.
//    Tên của các biến, được gọi là định danh, tuân theo các quy tắc nhất định.
//
//     Trong Viet Ngu mã định danh phải bắt đầu bằng một chữ cái (a,A,b,B...) hoặc dấu gạch dưới (_) hoặc dấu đô la ($). 
//     Các ký tự tiếp có thể dùng thêm các chữ số (0-9).
//
//     Một biến được khai báo bằng cách sử dụng câu lệnh "bien" không có giá trị thì sẽ có giá trị là nil.
//
//
//     Phạm vi của biến
//     Khi bạn khai báo một biến bên ngoài bất kỳ hàm nào, nó được gọi là "biến toàn cục", 
//     vì nó có sẵn trong bất kỳ code nào trong tài liệu hiện tại.
//
//     Khi bạn khai báo một biến trong một hàm, nó được gọi là "biến cục bộ", vì nó chỉ có sẵn trong hàm đó.
//


bien a;

viet(a); // viet nil

bien b = 5;

viet(b); // viet 5

bien c = "ten sang";

viet(c); // viet "ten sang"
`;

export default variables;