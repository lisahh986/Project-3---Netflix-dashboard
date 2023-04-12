import numpy as np

import sqlalchemy
from sqlalchemy import select
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask_cors import CORS

engine = create_engine("sqlite:///netflix.sqlite")
Base = automap_base()
Base.prepare(autoload_with=engine)
Show = Base.classes.netflix_show

app = Flask(__name__)
CORS(app)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/shows<br/>"
        f"/api/v1.0/showtypes"
    )

@app.route("/api/v1.0/shows")
def shows():
    session = Session(engine)

    statement = select(Show)
    data = []

    # Create a dictionary from the row data and append to a list of all_passengers
    results = session.execute(statement).fetchall()
    for record in results:
        show_dict = {}
        show_dict["show_type"] = record._mapping.netflix_show.show_type
        show_dict["title"] = record._mapping.netflix_show.title
        show_dict["director"] = record._mapping.netflix_show.director
        show_dict["cast_member"] = record._mapping.netflix_show.cast_member
        show_dict["country"] = record._mapping.netflix_show.country
        show_dict["release_year"] = record._mapping.netflix_show.release_year
        show_dict["rating"] = record._mapping.netflix_show.rating
        show_dict["duration"] = record._mapping.netflix_show.duration
        show_dict["listed_in"] = record._mapping.netflix_show.listed_in
        data.append(show_dict)

    session.close()

    response = jsonify(data)
    return response

@app.route("/api/v1.0/showtypes")
def showtypes():
    session = Session(engine)

    statement = select(Show.show_type, func.count(Show.show_type)).group_by(Show.show_type)

    results = session.execute(statement).fetchall()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    data = []
    for show_type, count in results:
        adict = {}
        adict["show_type"] = show_type
        adict["count"] = count
        data.append(adict)

    response = jsonify(data)
    return response

