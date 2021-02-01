import styles from "./InstagramFeed.module.scss";

const InstagramFeed = ({ instagramPosts }) => {
  return (
    <ul className={styles.social__container}>
      {instagramPosts.slice(0, 4).map(({ node }) => {
        return (
          <li className={styles.social__list} key={node.id}>
            <a href={`https://www.instagram.com/p/${node.shortcode}`}>
              <img
                className={styles.social__image}
                src={node.display_resources[0].src}
                alt={node.edge_media_to_caption.edges[0].node.text
                  .replace(/(#\w+)+/g, "")
                  .trim()}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default InstagramFeed;
