import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, MediaCard } from "components";
import { MediaItem } from "config/interface";
import { AppRootState } from "store";
import { fetchMedia } from "store/slices/media";
import styles from "./MediaContainer.module.css";
import { IMAGE_ENDPOINT, MediaCategory, Status } from "config/constants";
import { LinearProgress } from "@material-ui/core";

const MediaContainer = () => {
  const media = useSelector((state: AppRootState) => state.media);
  const dispatch = useDispatch();
  const { category, filter, status } = media;
  const isLoading = status === Status.PENDING;
  const isResolved = status === Status.RESOLVED;
  useEffect(() => {
    if (category !== MediaCategory.OTHER) {
      dispatch(fetchMedia());
    }
  }, [category, filter, dispatch]);

  return (
    <>
      {isResolved && media?.list?.length > 0 && (
        <Layout>
          {media?.list?.map((mediaItem: MediaItem) => {
            const imagePath = mediaItem.poster_path
              ? `${IMAGE_ENDPOINT}${mediaItem.poster_path}`
              : "";
            return (
              <MediaCard
                key={mediaItem.id}
                src={imagePath}
                title={
                  mediaItem.original_title ??
                  mediaItem.original_name ??
                  mediaItem.name
                }
              />
            );
          })}
        </Layout>
      )}
      {isResolved && media?.list?.length === 0 && (
        <section className={styles.noMediaAvailable}>
          <h1>No media content is available for the selected filters/query</h1>
        </section>
      )}
      {isLoading && (
        <div className={styles.progressLoader}>
          <LinearProgress />
        </div>
      )}
    </>
  );
};

export default MediaContainer;
