const loops = `
//    Bạn có thể coi vòng lặp như một phiên bản được máy tính hóa của trò chơi, nơi bạn yêu cầu ai đó thực hiện X bước theo một hướng,
//   sau đó Y bước sang một bước khác. Ví dụ: ý tưởng "Đi năm bước về phía đông" có thể được diễn đạt theo cách này như một vòng lặp:
//
//     Vòng lặp "cho" lặp lại cho đến khi một điều kiện cụ thể được đánh giá là sai.
//     Viet Ngu cho Vòng lặp tương tự với vòng lặp Java và C for.
//
//     Câu lệnh "cho" có dạng như sau:
//
//     cho ([Biểu_thức_ban_đầu]; [biểu_hiện_điều_kiện]; [biểu_thức_gia_tăng])
//         câu lênh
//
//
// Câu lênh trong_khi thực hiện các câu lệnh của nó miễn là một điều kiện được chỉ định đánh giá là đúng.
// Một câu lệnh while trông như sau:
//
//     trong_khi (điều_kiện)
//         câu lênh


bien num = 0;
    trong_khi (num < 5){
        viet(num);
        num = num + 1;
    }
    
cho (bien i = 0; i < 5; i = i + 1){
    viet(i);
}


`;


export default  loops;