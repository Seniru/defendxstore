import Button from "../../components/Button"
import ProfileImage from "../../components/ProfileImage"
import "./ForumThread.css"

const data = [
  { username: "User1", createdDate: "20/02/2023", content: "Reply 1" },
  { username: "User1", createdDate: "20/02/2023", content: "Reply 2" },
  { username: "User1", createdDate: "20/02/2023", content: "Reply 3" },
  { username: "User1", createdDate: "20/02/2023", content: "Reply 4" },
]

function ForumThreadReply({ username, createdDate, content }) {
  return (
    <div className="container thread-reply-container">
      <div>
        <ProfileImage username="User" size={50} />
        {username}
        <div className="secondary-text">{createdDate}</div>
      </div>
      <p>{content}</p>
    </div>
  )
}

export default function ForumThread() {
  return (
    <div className="content">
      <h1>Title</h1>
      <div className="forum-thread-main-content container">
        <div className="forum-thread-main-information">
          <div>
            <ProfileImage username="User" size={50} />
            Username
            <div className="secondary-text">20/02/2025</div>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed
          massa egestas, consequat lectus non, fringilla nisi. Quisque sapien
          arcu, maximus id scelerisque sodales, consectetur quis nisi. Nulla a
          scelerisque eros. Praesent neque lorem, finibus ut pretium sit amet,
          interdum ut est. Etiam eget aliquam felis. Nam lorem ex, rutrum
          fringilla tempor sed, fringilla non lacus. Etiam in purus sit amet
          tellus finibus congue. Cras nibh quam, commodo at iaculis non,
          ultrices ac mauris. Donec vulputate commodo nisl. Sed est ex, interdum
          sit amet ex in, commodo ullamcorper justo. Mauris ac iaculis justo.
          Phasellus gravida tempor urna at pretium. Proin eu convallis diam, eu
          euismod orci. Vestibulum semper posuere quam, a blandit elit bibendum
          vitae. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia curae; Nullam vestibulum pellentesque sem, ut
          cursus lacus convallis eget. Suspendisse ac posuere turpis. Sed
          elementum erat magna, sed lacinia lacus posuere ut. Etiam in justo ut
          risus sagittis consectetur nec eu odio. Ut ac ullamcorper neque, eu
          convallis augue. Nullam nunc eros, auctor sed tincidunt quis, ultrices
          ut ante. Aenean volutpat, nisi sit amet convallis rhoncus, mi diam
          dignissim nisi, sed vestibulum nunc dui sed magna. Nullam in nulla
          tellus. Vestibulum et mattis tellus, nec efficitur mi. In ut enim
          ultrices leo porta feugiat a rutrum elit. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas.
          Suspendisse ac fermentum ante. Proin porta pharetra neque vel
          porttitor. Aenean lacinia fermentum augue in pellentesque. Vestibulum
          imperdiet non dui a molestie. Donec magna mi, lobortis quis sodales
          ac, viverra vel quam. Donec quis massa condimentum, condimentum nibh
          malesuada, semper lacus. Integer non viverra dolor. Vestibulum commodo
          lectus lacus, in semper mi molestie non. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed id odio nisl. Nunc suscipit sodales
          ante, eu fermentum ante consectetur vel. Nullam quis nisi nec mi
          pretium dictum. Duis feugiat vehicula massa et interdum.
        </p>
      </div>
      <br />
      <hr />
      <h3>Replies</h3>
      {data.map((reply) => (
        <ForumThreadReply
          content={reply.content}
          username={reply.username}
          createdDate={reply.createdDate}
        />
      ))}
      <hr />
      <h3>Answer</h3>
      <textarea rows={5} cols={100}></textarea>
      <hr />
      <br />
      <Button kind="primary">Submit</Button>
    </div>
  )
}
