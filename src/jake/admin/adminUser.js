import User from "../../models/User";
import paginate from "express-paginate";
import routes from "../../routes";

// 관리자 계정 관리
export const adminUser = async (req, res) => {
  try {
    const {
      query: { searchKey, searchValue, limit },
    } = req;

    const findQuery = {
      $or: [{ role: "admin" }, { role: "master" }, { role: "general" }],
    };
    const sortQuery = { createdAt: 1 };

    // BEGIN: 검색 기능이 있을 경우
    const searchArr = [
      { code: "0", title: "아이디", value: "userID", type: "string" },
      { code: "1", title: "이름", value: "name", type: "string" },
    ];
    if (searchKey && searchValue) {
      findQuery[`${searchArr[parseInt(searchKey, 10)].value}`] = {
        $regex: searchValue,
        $options: "i",
      };
    }
    // END: 검색 기능이 있을 경우

    const [adminItems, totalCount] = await Promise.all([
      User.find(findQuery)
        .sort(sortQuery)
        .limit(req.query.limit)
        .skip(req.skip)
        .exec(),
      User.countDocuments(),
    ]);
    const pageCount = Math.ceil(totalCount / req.query.limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);

    // 엑셀 다운로드용 전체 데이터
    const excelData = await User.find().sort(sortQuery);

    res.render("product/productUser", {
      adminNameKo: "관리자 계정",
      adminLink: routes.adminUser,
      limit,
      searchArr,
      searchKey,
      searchValue,
      adminItems,
      totalCount,
      pageCount,
      pages,
      excelData,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
  location.href="${routes.home}"</script>`
    );
  }
};
export const adminUserApprove = async (req, res) => {
  try {
    const {
      params: { userID },
    } = req;
    await User.findByIdAndUpdate(userID, { role: "admin" });
    res.send(
      `<script>\
    alert("승인 되었습니다.");\
    location.href="${routes.admin}${routes.adminUser}"\
  </script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
  location.href="${routes.home}"</script>`
    );
  }
};
export const adminUserDelete = async (req, res) => {
  try {
    const {
      params: { userID },
    } = req;
    await User.findByIdAndDelete(userID);
    res.send(
      `<script>location.href="${routes.admin}${routes.adminUser}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
  location.href="${routes.home}"</script>`
    );
  }
};
