const primitiveText = `
// Chào mừng bạn đến với sân chơi Việt Ngữ, đây là một trang web mang 
// đến cho bạn cơ hội viết, chia sẻ và học hỏi về Việt Ngữ.

// Bạn có thể nghĩ về nó theo ba cách::
//
//  - Một nơi để học Việt Ngữ không cần sợ sai. 
//  - Nơi giúp bạn thử nghiệm các cú pháp Việt Ngữ và chia sẻ URL với những người khác
//  - Một khu vui chơi để thử nghiệm các tính năng biên dịch khác nhau của Việt Ngữ

// Việt Ngữ là một ngôn ngữ lập trình biên dịch gọn nhẹ, được thông dịch hoặc JIT 
// với các hướng của hàm và có thể sử dụng lớp.

bien anExampleVariable = "chao the gioi";
viet(anExampleVariable);

ham closure(x){
    ham inner(y){
        tra x + y;
    }
    
    tra inner;
}
bien add3 = closure(3);
viet(add3(5));
`

export default primitiveText;