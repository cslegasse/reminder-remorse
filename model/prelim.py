import pandas as pd
import numpy as np


sbp_hr = np.array([
    1.17,1.10,1.08,1.02,1,0.99,1.00,1.03
])
dbp_hr = np.array([
    1.04,1.01,1.01,1,1.02,1.06,1.11
])
# Adjustment for age, sex, body mass index, smoking history, alcohol consumption,
# physical activity level, socioeconomic status, use of antihypertensive medication,
# history of type 2 diabetes, chronic kidney disease, and cardiovascular disease
sbp_counts = np.array([
    67870, 255597, 809897, 1004216, 1327291,
    523553, 312170, 221853
])
dbp_counts = np.array([
    67372, 597977, 1520015, 1671580, 502417,
    136778, 2397
])
sbp_base = (64562/1327291)
dbp_base = (80477/1671580)

ad_sbp_p = sbp_hr * sbp_base # chance of AD given systolic blood pressure
ad_dbp_p = dbp_hr * dbp_base # chance of AD given diastolic blood pressure
sbp_p = sbp_counts/np.sum(sbp_counts) # chance of each systolic blood pressure
dbp_p = dbp_counts/np.sum(dbp_counts) # chance of each diastolic blood pressure
# SBP: <100, 100-110, 110-120, 120-130, 130-140, 140-150, 150-160, >=160
# DBP: <60, 60-70, 70-80, 80-90, 90-100, 100-110, >=110



df = pd.read_csv('data/sleep_lifestyle.csv')

print(df)