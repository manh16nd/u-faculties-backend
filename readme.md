# u-faculties backend

### Mô hình của app 
- App sẽ chỉ phục vụ RESTfull API, giao tiếp thông qua cổng 3000.
- Các API gọi tới sẽ được serve tùy vào route của API.
- Các API của giảng viên và nhân viên phòng Đào tạo sẽ cần có Auth Token, ta sẽ thêm sau.

### Lưu ý về routing
- Các API gọi tới sẽ được serve theo route được quy định trong các file trong thư mục `routes`.
- Các routes được match theo thứ tự từ trên xuống, khi matching đúng sẽ dừng lại và gọi hàm callback được khai báo. Ví dụ:
```$js
router.get('/index/123', function1)
router.get('/index/123', function2)
```
- Trong ví dụ này, một API gọi tới có route là `/index/123` sẽ luôn luôn gọi tới `function1`. Mặc dù không có lỗi gì cả, tuy nhiên cần phải chú ý.
- Trường hợp hay xảy ra nhất là khi trong route có params. Ví dụ, ta có API sửa thông tin giảng viên theo ID, và có API xóa tất cả giảng viên. Một trường hợp khai báo không tốt là như này:
```
router.post('/lecturers/:lecturerId', editLecturer)
router.post('/lectures/removeAll', removeAllLecturers)
```
- `:lecturerId` ở đây nghĩa là Express sẽ nhận giá trị đằng sau `/lecturers` là `lecturerId`, và ta lấy giá trị nó qua `req.params.lecturerId`.
- Trường hợp này tệ bởi vì ta sẽ không bao giờ gọi được API `removeAll`. Express sẽ luôn nhận `removeAll` là một `lectureId` và gọi hàm editLecturer.
- Dĩ nhiên ta có nhiều cách sửa, ví dụ như edit thì sẽ là `router.patch` còn remove là `router.delete`. Nhưng vẫn cần lưu ý.

### Lưu ý về controllers
- Xem ví dụ mẫu về edit author tại file `/controllers/root`.
- Tại `routes`, chúng ta đã đưa req và res cho controller (rất đơn giản là khai báo tên hàm controller ra trong callback).
- Chúng ta sẽ không validate dữ liệu tại controller. Việc đó để cho actions lo. Chúng ta chỉ sàng lọc những trường nào cần thiết để đưa cho actions, lấy từ `req.params`, `req.body` (body của JSON), `req.query` (là những query sau dấu ? trên URL `/?query=query2=`)
- Tại controller, chúng ta sẽ gọi hàm tương ứng trong actions. Vì NodeJS là một ngôn ngữ bất đồng bộ, ta cần phải đợi cho hàm actions chạy xong thì mới trả về response cho client được.
- Hiện tại tuy ở actions tôi đã dùng ES7 (async, await), tuy nhiên, ở controller vẫn dùng ES5 (`.then().catch()`).
- Hàm actions nếu như không có lỗi gì, tất cả những thứ `return` sẽ đổ vào `.then()`, ngược lại, nếu `throw new Error()` hoặc chương trình tự sinh lỗi, sẽ được đổ vào `.catch()`
- Cấu trúc response: Nếu như không có lỗi, JSON trả về là 
```$json
{
    "success": true,
    // "whatever you want": result // result này lấy từ .catch(result). Xem ví dụ để rõ hơn
}
```
- Còn nếu lỗi, sẽ là 
```$json
{
    "success": false,
    err: e.message || e,
}
```
- Các response chúng ta trả về, trong điều kiện mạng và server ổn định, đều có status `200`.

### Lưu ý về actions 
- Xem ví dụ mẫu tại `/actions/root/rootActions`
- Chúng ta khai báo model tại `/models/tên-model`, sau đó tổng hợp lại về file `index` cùng thư mục để dễ kiểm soát.
- Hàm actions muốn dùng models sẽ gọi `const models = require(path-của-file-model/index.js)` để lấy tất cả các models. Mỗi model sẽ là một attribute của object này. Ví dụ muốn lấy model `Authors`, ta lấy `models.Authors`.
- Đọc kỹ docs của mongoose, chúng ta cũng chỉ dùng 4 5 hàm cùng 1 số tính năng thôi.
- Validate dữ liệu: tôi đã viết một số hàm validate String, validate không phải là `null` hoặc `undefined`, ... Ta cần validate dữ liệu trước khi sửa xóa, tuy chỉ là project cuối kì nhưng cũng cần làm cẩn thận. Đã làm là làm cẩn thận, đạo đức nghề nghiệp chúng ta không cho phép ẩu.
- Get dữ liệu thì đơn giản rồi, dữ liệu lấy được chúng ta chỉ cần return. 
- Tuy nhiên tạo mới, sửa  và xóa thì output của hàm của mongoose nó hơi khác. 
- Tạo mới thì ta chỉ cần return kết quả của hàm `.save()`
- Sửa thì ta sẽ được một object, quan tâm trường ```{ok, nModified}``` thôi. Bất cứ khi nào sửa thì ta cũng phải tìm xem đã tồn tại document đấy chưa. Nếu chưa thì coi như xong. Nếu rồi thì ta cần phải xem nó `nModified !== 0` chưa, nếu rồi thì ta sẽ trả về document vừa tìm được, sau đó chèn các giá trị cần sửa vào (tôi có làm ví dụ). Nếu không thì ta chỉ cần trả về giá trị cũ đã tìm được.
- Xóa cũng tương tự, tuy nhiên tôi thống nhất output chỉ là true hoặc false.

### Tổng kết
- Từ giờ đến hết lễ, chúng ta sẽ cố gắng xong API của 1 2 models. Chú ý cả quan hệ của nó nữa. Thực ra mongoDB thì chẳng có quan hệ nào đâu. Ở các cơ sở dữ liệu khác thì thêm sửa xóa nó rất lằng nhằng vì còn quan hệ. Nhưng ở mongo thì thoải mái. Những quan hệ này có là do thư viện mongoose tự tạo ra. Tôi sẽ nói rõ hơn sau.
- Trước mắt, tôi sẽ làm API quản lý user. Ông sẽ làm API get giảng viên dành cho sinh viên. Sẽ có tầm 3 4 cái API như này.
