import { useEffect, useState } from "react";
import like from "../../assets/like.png";
import noImage from "../../assets/no-image.png";
import comment from "../../assets/comment.png";
import {
  getCategoryString,
  getCategoryListString,
  getDateString,
} from "../questions/utils";
import FilterBar from "../FilterBar/FilterBar";
import {
  BLOG_POST_CONTENT_TYPE,
  NEWEST,
} from "../../constants/search_constants";
import useSearchContent from "../../hooks/useSearchContent";

import { Tooltip } from "react-tooltip";
import CustomPagination from "../Pagination/CustomPagination";
import { PAGE_SIZE } from "../../constants/common_constants";

export const BlogPosts = () => {
  const defaultSearchData = {
    object_content_type: BLOG_POST_CONTENT_TYPE,
    order_by: [NEWEST],
    page: 1,
  };

  const [searchData, setSearchData] = useState(defaultSearchData);

  const [searchFormState, setSearchFormState] = useState({
    checkBoxChecked: false,
    query: "",
    selectedCategories: [],
  });

  const { data, isLoading } = useSearchContent(searchData);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="container main-content">
      <FilterBar
        searchData={searchData}
        setSearchData={setSearchData}
        searchFormState={searchFormState}
        setSearchFormState={setSearchFormState}
        contentType={"blog post"}
        mostFilters={[
          { id: "most-comments", name: "Most Comments" },
          { id: "most-likes", name: "Most Likes" },
        ]}
        createButton={{ name: "Create Blog Post", link: "/create-blog-post" }}
      />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p className="results-count">{data?.count} results</p>
          {data?.results?.map((blogPost) => {
            return <BlogPost key={blogPost.id} blogPost={blogPost} />;
          })}
        </div>
      </div>
      {Math.ceil(data?.count / PAGE_SIZE) > 1 && (
        <CustomPagination
          totalCount={data?.count}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      )}
    </div>
  );
};

export const BlogPost = ({ blogPost }) => {
  const {
    id,
    created_at,
    author,
    image_url,
    title,
    short_content,
    likes,
    number_of_comments,
    categories,
  } = blogPost;

  return (
    <div className="welcome-container question-box">
      <div className="row">
        <div className="col-md-6 author">
          {/* <img
            src={answer}
            width="30px"
            height="30px"
            style={{ marginRight: "5px" }}
          /> */}
          {author?.username}{" "}
          <span className="date">posted {getDateString(created_at)}</span>
        </div>
        <div className="col-md-6 categories">
          <span
            style={{ cursor: "pointer" }}
            data-tooltip-id="my-tooltip"
            data-tooltip-html={getCategoryListString(categories)}
          >
            {getCategoryString(categories)}
          </span>
          <Tooltip id="my-tooltip" place="right" />
        </div>
      </div>
      <p className="question-heading">
        <a href={`/blog-posts/${id}`}>{title}</a>
      </p>
      <div className="row">
        <div className="col-md-6">
          {image_url !== null ? (
            <img src={image_url} style={{ width: "100%" }} alt="" />
          ) : (
            <img src={noImage} style={{ width: "100%" }} alt="" />
          )}
        </div>
        <div className="col-md-6">
          {short_content && (
            <p
              className="question-description"
              dangerouslySetInnerHTML={{ __html: short_content }}
              style={{ border: "none" }}
            />
          )}
        </div>
      </div>
      <div className="question-footer">
        <div className="question-wrapper">
          <div className="question-info">
            <div>
              <img src={like} alt="likes" width="25px" height="21px" />
              <span>
                <span>{likes}</span> likes
              </span>
            </div>
          </div>
          <div className="question-info">
            <div>
              <img src={comment} alt="answers" width="25px" height="23px" />
              <span>
                <span>{number_of_comments}</span> comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
