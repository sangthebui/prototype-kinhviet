const arrays = `
// Mảng là một danh sách có thứ tự các giá trị mà bạn tham chiếu đến với tên và mục lục.
//
//     Viet Ngu không có kiểu dữ liệu mảng rõ ràng.
//     Tuy nhiên, bạn có thể sử dụng đối tượng Mảng được xác định trước và các phương thức của nó để làm việc với các mảng trong code của bạn.
//     Đối tượng Mảng có các phương thức để thao tác với các mảng theo nhiều cách khác nhau, chẳng hạn như nối, đảo ngược và sắp xếp chúng.
//     Nó có một thuộc tính để xác định độ dài mảng và các thuộc tính khác để sử dụng với các biểu thức chính quy.
//
//bien arr2 = Mang(element0, element1, ..., elementN)
//bien arr3 = [element0, element1, ..., elementN]


bien arr = Mang(1);

arr.set(0, "value");
viet(arr.get(0));

bien arr = [10, 20, 30];

arr[0] = 33; //

viet(arr.length);
cho (bien i = 0; i < arr.length; i = i + 1){
    viet(arr[i]);
}
    
`;

export default arrays;