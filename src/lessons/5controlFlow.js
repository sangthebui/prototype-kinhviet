const controlFlow = `
// Viet Ngu là một tập hợp các câu lệnh nhỏ gọn, cụ thể là các câu lệnh điều khiển,
// mà bạn có thể sử dụng để kết nói nhiều sự tương tác trong code của mình.

// Câu lệnh điều kiện
//Câu lệnh điều kiện là một tập hợp các lệnh được thực hiện nếu một điều kiện được chỉ định là đúng.
//Viet Ngu có hai âu lệnh điều kiện: nếu...khác and đỏi.

// neu...khac câu_lênh
// neu (condition) {
//     câu_lênh_1;
// } khac {
//     câu_lênh_2;
// }
//
// đỏi câu_lênh
// Đỏi  cho phép một chương trình đánh giá một biểu thức và cố gắng so khớp giá trị của biểu thức với một trường hợp.
// Nếu tìm thấy một kết quả phù hợp, máy sẽ thực hiện những câu lệnh đó.
//
//         Câu lệnh đỏi viết như sao:
//
//         doi (biểu_thức) {
//                truong_hop 1:
//                   câu_lênh_1;
//                   nghi;
//                truong_hop 2:
//                   câu_lênh_2;
//                   nghi;
//                khiem_dien:
//                  câu_lênh_khiem_dien;
//     }


bien jump = dung;

neu ( jump == sai) {
    viet("I am jumped over else.");
} khac {
    viet("I should not jump.");
}



 doi (2) {
    
        truong_hop 1: 
          viet("one");
        truong_hop 2:
          viet("two");
        truong_hop 3:
          viet("three");
        khiem_dien:
          viet("default");
    }

`;

export default controlFlow;