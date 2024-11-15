import requests
import json
import math

class RateMyProfScraper:
    def __init__(self, schoolid):
        self.UniversityId = schoolid
        self.professorlist = self.createprofessorlist()

    def createprofessorlist(self):
        # Creates a list of all professors with basic information from the identified university
        tempprofessorlist = []
        num_of_prof = self.GetNumOfProfessors(self.UniversityId)
        num_of_pages = math.ceil(num_of_prof / 20)
        for i in range(1, num_of_pages + 1):
            page = requests.get(
                f"http://www.ratemyprofessors.com/filter/professor/?&page={i}&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid={self.UniversityId}"
            )
            temp_jsonpage = json.loads(page.content)
            temp_list = temp_jsonpage.get('professors', [])
            tempprofessorlist.extend(temp_list)
        return tempprofessorlist

    def GetNumOfProfessors(self, id):
        # Returns the total number of professors in the university of the given ID.
        page = requests.get(
            f"http://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid={id}"
        )
        temp_jsonpage = json.loads(page.content)
        num_of_prof = temp_jsonpage.get('remaining', 0) + 20  # Approximate number of professors
        return num_of_prof

    def PrintAllProfessorsRatings(self):
        # Prints each professor's name and overall rating
        for professor in self.professorlist:
            name = f"{professor.get('tFname', '')} {professor.get('tLname', '')}"
            rating = professor.get('overall_rating', 'No rating')
            print(f"{name}: {rating}")

# Example usage for Emory University
emory_id = 340  
EmoryUniversity = RateMyProfScraper(emory_id)
EmoryUniversity.PrintAllProfessorsRatings()