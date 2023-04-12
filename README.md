# Data

Original data downloaded from [Kaggle Netflix shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
It's in CSV format and was converted to SQL insert statements
These statements was imported to netflix.sqlite DB

# How to run 

## Backend

* Install pipenv
```
python3 -m pip install --user pipenv
```

* Use pipenv to install dependencies
```
pipenv install
```

* Run app
```
pipenv run python3 -m flask --app app run --debug
```

Open `index.html` to see the charts