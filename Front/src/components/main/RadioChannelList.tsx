import styles from './RadioChannelList.module.scss';

const RadioChannelList = () => {
  const channels = ['Channel 1', 'Channel 2', 'Channel 3'];

  return (
    <div className={styles.radioList}>
      <div>라디오 채널</div>
      <div>관심분야의 논문 라디오를 들어보세요</div>
      {channels.map((channel, index) => (
        <div
          key={index}
          className={styles.channelItem}
        >
          {channel}
        </div>
      ))}
    </div>
  );
};

export default RadioChannelList;
