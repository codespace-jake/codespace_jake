import routes from "../routes";
import paginate from "express-paginate";
import Product from "../models/Product";

// 홈 Home
export const home = async (req, res) => {
  try {
    res.render("home");
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

export const anotherController = () => {};

// 상품 Product

export const product = async (req, res) => {
  try {
    const {
      query: { sort, limit },
    } = req;

    // findQuery default 값
    const findQuery = {};
    // sortQuery default 값
    let sortQuery = { createdAt: -1 };

    // BEGIN: 분류 기능이 있을 경우
    const sortArr = [
      { code: "0", title: "가격 높은 순", value: "salePrice", order: -1 },
      { code: "1", title: "가격 낮은 순", value: "salePrice", order: 1 },
      { code: "2", title: "최신순", value: "createdAt", order: -1 },
      { code: "3", title: "이름순", value: "name", order: 1 },
    ];

    const sortCode = sort || sortArr[0].code;
    if (sort) {
      sortQuery = {};
      sortArr.forEach((x, i) => {
        if (x.code === sort)
          sortQuery[`${sortArr[i].value}`] = sortArr[i].order;
      });
    }

    // END: 분류 기능이 있을 경우

    // BEGIN: pagination 데이터
    const [adminItems, totalCount] = await Promise.all([
      Product.find(findQuery)
        .sort(sortQuery)
        .limit(limit)
        .skip(req.skip)
        .exec(),
      Product.countDocuments(findQuery),
    ]);

    const pageCount = Math.ceil(totalCount / limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);
    // END: pagination 데이터

    res.render("product", {
      adminNameKo: "상품 데이터",
      adminLink: routes.adminProduct,
      adminItems,
      sortArr,
      sortCode,
      totalCount,
      pageCount,
      pages,
      limit,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};
