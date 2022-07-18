const functions = `
//
// Hàm là một trong những nền tảng cơ bản của Việt Ngữ.
// Một hàm trong Việt Ngữ tương tự như một thủ tục — một tập hợp các câu lệnh thực hiện một nghiệm vụ hoặc tính toán một giá trị
// ,nhưng để một thủ tục đủ điều kiện là một hàm, nó phải nhận một số đầu vào và trả về một số đầu ra, 
// trong đó có một số mối quan hệ rõ ràng giữa đầu vào và đầu ra.
// Để sử dụng một hàm, bạn phải khai báo nó ở đâu đó trong phạm vi mà bạn muốn gọi nó.
// 
// 
// Khai báo hàm
//
// Định nghĩa hàm (còn được gọi là khai báo hàm hoặc câu lệnh hàm) bao gồm từ khóa hàm, theo sau là:
//
// Tên của hàm.
// Danh sách các tham số của hàm, được đặt trong dấu ngoặc đơn và được phân tách bằng dấu phẩy.
// Trông Viet Ngu câu lệnh xác định hàm, được đặt trong dấu ngoặc nhọn {...}.
//
// ham nhan_doi(số) {
//   tra số * số;
// }
//
// Hàm nhan_doi  nhận một tham số, được gọi là số. Hàm bao gồm một câu lệnh trả về tham số của hàm 
//  (tức là số) nhân với chính nó.
// Câu lệnh "trả" trả lại giá trị của hàm:
//
// tra số * số;
//
// Các tham số về cơ bản được chuyển cho các hàm theo giá trị - vì vậy nếu code trong
// nội dung của một hàm gán một giá trị hoàn toàn mới cho một tham số đã được chuyển đến
// hàm, sự thay đổi số trông hàm không ảnh hưởng trên toàn cục hoặc trong code gọi hàm đó.
//
// Việc xác định nghĩa hàm khác với gọi tên hàm. Định nghĩa hàm đặt tên cho hàm và chỉ định những việc cần làm khi hàm được gọi.
//
// nhan_doi(10); // 100
//
// Phạm vi hàm
// Các biến được xác định bên trong một hàm không thể được truy cập từ bên ngoài hàm, 
// vì biến chỉ được xác định trong phạm vi của hàm.
// Tuy nhiên, một hàm có thể truy cập tất cả các biến và hàm được xác định bên trong phạm vi mà nó được định nghĩa.
//
// đệ quy
// Một hàm có thể tham chiếu đến và gọi chính nó.



ham foo(i) {
  neu (i < 0) {
    tra;
  }
  viet(i);
  foo(i - 1);
}
foo(3);




`;


export default functions;