const Loading = () => {
    return (
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-grow text-primary mx-2" role="status" />
            <div className="spinner-grow text-light mx-2" role="status" />
            <div className="spinner-grow text-success mx-2" role="status" />
            <div className="spinner-grow text-danger mx-2" role="status" />
            <div className="spinner-grow text-warning mx-2" role="status" />
            <div className="spinner-grow text-info mx-2" role="status" />
            <div className="spinner-grow text-dark mx-2" role="status" />
        </div>
    )
}

export default Loading
