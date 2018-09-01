// @flow
var elMap, matrixToHtml;

elMap = (xs) => {
  return (f) => {
    return (xs.map(f)).join('');
  };
};

matrixToHtml = (matrix/*: CommitMatrix */)/*: string */ => {
  var committers, emailHeadings, emails, fileRows;
  emails = elMap(matrix.emails);
  emailHeadings = emails((email) => {
    return `<th scope='col'>${email}</th>`;
  });
  committers = elMap(matrix.matrix);
  fileRows = committers((committer) => {
    var fileScores;
    fileScores = elMap(committer.fileScores);
    return fileScores((fileScore, i) => {
      var fileCols;
      fileCols = committers((committer) => {
        return `<td>${committer.fileScores[i].score}</td>`;
      });
      return `<tr><th scope='row'>${fileScore.fileName}</th>${fileCols}</tr>`;
    });
  });
  return `<table><tr><td></td>${emailHeadings}</tr>${fileRows}</table>`;
};

module.exports = {matrixToHtml};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyTWF0cml4LmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmMvcmVuZGVyTWF0cml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLElBQUEsS0FBQSxFQUFBOztBQUVBLEtBQUEsR0FBUSxDQUFDLEVBQUQsQ0FBQSxHQUFBO1NBQVEsQ0FBQyxDQUFELENBQUEsR0FBQTtXQUFPLENBQUMsRUFBRSxDQUFDLEdBQUgsQ0FBTyxDQUFQLENBQUQsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsRUFBaEI7RUFBUDtBQUFSOztBQUVSLFlBQUEsR0FBZSxDQUFDLHlCQUFELGNBQUEsR0FBQTtBQUNiLE1BQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxNQUFBLEVBQUE7RUFBQSxNQUFBLEdBQVMsS0FBQSxDQUFNLE1BQU0sQ0FBQyxNQUFiO0VBQ1QsYUFBQSxHQUFnQixNQUFBLENBQU8sQ0FBQyxLQUFELENBQUEsR0FBQTtXQUFXLENBQUEsZ0JBQUEsQ0FBQSxDQUFtQixLQUFuQixDQUF5QixLQUF6QjtFQUFYLENBQVA7RUFDaEIsVUFBQSxHQUFhLEtBQUEsQ0FBTSxNQUFNLENBQUMsTUFBYjtFQUNiLFFBQUEsR0FBVyxVQUFBLENBQVcsQ0FBQyxTQUFELENBQUEsR0FBQTtBQUNwQixRQUFBO0lBQUEsVUFBQSxHQUFhLEtBQUEsQ0FBTSxTQUFTLENBQUMsVUFBaEI7V0FDYixVQUFBLENBQVcsQ0FBQyxTQUFELEVBQVksQ0FBWixDQUFBLEdBQUE7QUFDVCxVQUFBO01BQUEsUUFBQSxHQUFXLFVBQUEsQ0FBVyxDQUFDLFNBQUQsQ0FBQSxHQUFBO2VBQWUsQ0FBQSxJQUFBLENBQUEsQ0FBTyxTQUFTLENBQUMsVUFBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQS9CLENBQXFDLEtBQXJDO01BQWYsQ0FBWDthQUNYLENBQUEsb0JBQUEsQ0FBQSxDQUF1QixTQUFTLENBQUMsUUFBakMsQ0FBMEMsS0FBMUMsQ0FBQSxDQUFpRCxRQUFqRCxDQUEwRCxLQUExRDtJQUZTLENBQVg7RUFGb0IsQ0FBWDtTQUtYLENBQUEsb0JBQUEsQ0FBQSxDQUF1QixhQUF2QixDQUFxQyxLQUFyQyxDQUFBLENBQTRDLFFBQTVDLENBQXFELFFBQXJEO0FBVGE7O0FBV2YsTUFBTSxDQUFDLE9BQVAsR0FBaUIsQ0FDZixZQURlIiwic291cmNlc0NvbnRlbnQiOlsiIyBAZmxvd1xuXG5lbE1hcCA9ICh4cykgPT4gKGYpID0+ICh4cy5tYXAgZikuam9pbiAnJ1xuXG5tYXRyaXhUb0h0bWwgPSAobWF0cml4ICMjIzogQ29tbWl0TWF0cml4ICMjIykgIyMjOiBzdHJpbmcgIyMjID0+XG4gIGVtYWlscyA9IGVsTWFwIG1hdHJpeC5lbWFpbHNcbiAgZW1haWxIZWFkaW5ncyA9IGVtYWlscyAoZW1haWwpID0+IFwiPHRoIHNjb3BlPSdjb2wnPiN7ZW1haWx9PC90aD5cIlxuICBjb21taXR0ZXJzID0gZWxNYXAgbWF0cml4Lm1hdHJpeFxuICBmaWxlUm93cyA9IGNvbW1pdHRlcnMgKGNvbW1pdHRlcikgPT5cbiAgICBmaWxlU2NvcmVzID0gZWxNYXAgY29tbWl0dGVyLmZpbGVTY29yZXNcbiAgICBmaWxlU2NvcmVzIChmaWxlU2NvcmUsIGkpID0+XG4gICAgICBmaWxlQ29scyA9IGNvbW1pdHRlcnMgKGNvbW1pdHRlcikgPT4gXCI8dGQ+I3tjb21taXR0ZXIuZmlsZVNjb3Jlc1tpXS5zY29yZX08L3RkPlwiXG4gICAgICBcIjx0cj48dGggc2NvcGU9J3Jvdyc+I3tmaWxlU2NvcmUuZmlsZU5hbWV9PC90aD4je2ZpbGVDb2xzfTwvdHI+XCJcbiAgXCI8dGFibGU+PHRyPjx0ZD48L3RkPiN7ZW1haWxIZWFkaW5nc308L3RyPiN7ZmlsZVJvd3N9PC90YWJsZT5cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWF0cml4VG9IdG1sXG59Il19
//# sourceURL=/home/jpreston/Sync/proj/eyeson/2018-08-26/src/renderMatrix.coffee