import Comment from '../components/Comment'


export const boilerPlate = (item, index) => (
    <article className='result-card' key={index}>

        <div className="name">
            <p id="card-name">{item.place}</p>
            <p id="card-county">{item.county}</p>
        </div>

        <div className="rating">
            <span id="first">{(Math.floor(Math.round(((item.accumRating / 3) / item.count) * 10) / 10))}.</span><span id="last">{Math.round(((Math.round(((item.accumRating / 3) / item.count) * 10) / 10) - Math.floor(Math.round(((item.accumRating / 3) / item.count) * 10) / 10).toFixed()) * 10)}</span>
        </div>

        <div className="reviews">
            {item.count > 1 ? <span>{item.count} reviews</span> : <span>{item.count} review</span>}
        </div>

        <Comment
            cleanRating={Math.round(item.cleanRating / item.count * 10) / 10}
            staffRating={Math.round(item.staffRating / item.count * 10) / 10}
            adheranceRating={Math.round(item.adheranceRating / item.count * 10) / 10}
            extraData={item.extraData}
        />
    </article >
)