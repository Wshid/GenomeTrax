(function()
{
	/* Angular를 사용하기 위한 기본 환경 셋팅 및 get, set 메소드, 기본적인 js 코드들이 포함되어 있음 */
	agGrid.initialiseAgGridWithAngular1(angular); /* 데이터 그리드 관련 객체인 것으로 확인됨 */

	var app = angular.module("test", ['test.Services', 'ngAnimate', 'ngCookies', 'agGrid']);
		/* test 모듈이 다른 부가 모듈에 의존관계를 가지고 있을때, 사용할 모듈을 지정한다. */

	app.controller("GlobalController", ['$scope', '$cookies', '$window', '$timeout',function($scope, $cookies, $rootScope, $timeout, $window,Services)
	{
		this.tab = 'Intro';

		this.optimizationPopUpFlag = true;
	    this.optimizationPopUpFlagCookie = $cookies.get('optimizationPopUpFlag');;
   	    $scope.optimizationPopUpText = '해당 웹사이트는 PC 환경 크롬 브라우저에 최적화 되어있습니다. 기타 문의사항은 kso4013@gmail.com로 연락 주시기 바랍니다.';

  		this.downloadSettingPopUpFlag = true;
	    this.downloadSettingPopUpFlagCookie = $cookies.get('downloadSettingPopUpFlag');
	    $scope.downloadSettingPopUpText = '여러 개의 그림 다운로드 창으로 불편하실 땐, 크롬의 [설정  >  고급설정 표시  >  다운로드  >  다운로드 전에 각 파일의 저장 위치 확인] 체크 박스를 해제해주세요.';

	    this.noInputPopUpFlag = true;
	    $scope.noInputPopUpText = 'Genome Coordinate 검색 입력 값이 없습니다.';

	    this.regionMaxmiumPopUpFlag = true;
	    $scope.regionMaxmiumPopUpText = '가 검색 한계 범위인 1Mbps를 넘었습니다.';

	    this.reversedRegionPopUpFlag = true;
	    $scope.reversedRegionPopUpFText = '의 검색 시작 지점이 끝 지점보다 큽니다.';

	    this.noDatabasePopUpFlag = true;
	    $scope.noDatabasePopUpText = '선택된 데이터베이스가 없습니다.';

			this.unCorrectRegularExpression = true;
	    $scope.unCorrectRegularExpression = '입력 내용을 다시 확인해 주세요';

	    this.noGenePopUpFlag = true;
	    //$scope.noGenePopUpText = 'Gene 검색 입력 값이 없습니다.';
			$scope.noGenePopUpText = 'Gene 검색 입력 값이 없거나 올바르지 않습니다.';

	    this.genePopUpFlag = true;
	    this.pathwayPopupFlag = true;
	    this.inputErrorPopupFlag = true;
	    this.loadingFlag = false;
	    this.databaseListFlag = false;

	    this.genometraxMoreExamplesPopUpFlag = false;
	    this.keggMoreExamplesPopUpFlag = false;
	    this.keggExplanationPopUpFlag = false;


  	    $scope.hgVersion = 'hg19';
	    $scope.downloadStatus = 'current';

	    $scope.currentDatabaseNumber = 0;
	    $scope.currentDatabaseName = "";
		$scope.popUpText = '';
		$scope.window = window;
		$scope.agGridTableElement = document.getElementById('agGridTable');
		$scope.agGridClass = document.getElementsByClassName('ag-blue')[0];

		$scope.multipleFilesPlaceHolderValue = 'Choose \'bam\' and \'bai\' Format Files';
		$scope.input_file_list_length = 0;

    	var columnDefs = [];
    	var rowData = [];


    	$scope.gridOptions = {
        rowData: rowData,
        //rowHeight: $scope.agGridTableElement === null ? 0 : (window.innerHeight)/49,
        //rowHeight: $scope.agGridTableElement === null ? 0 : (window.innerHeight)/49,
      	enableColResize: true,
        suppressMovableColumns: true,
				enableFilter: true,
        onGridReady: function()
        {
        		$scope.gridOptions.api.setColumnDefs(columnDefs);
	    }

	    };

	    this.initailizeBody = function()
	    {
	    	var inputWidth = (window.innerWidth < 940)? 940: window.innerWidth;
	    	//var inputHeight = (window.innerHeight < 560)? 560: window.innerHeight;
				if(window.innerHeight<560){
					var inputHeight=560;
					document.body.style.height = inputHeight + "px";
				}

	    	document.body.style.width = inputWidth + "px";
	    	//document.body.style.height = inputHeight + "px";

	    	//$scope.agGridClass.style.fontSize = 1*(inputHeight/1350) + "em";
	    }

			this.export_xlsx_js= function(){ //excel 다운로드를 가능하게 할 부분
				var params={
					allColumns: true,
					fileName: "Genometrax_Search_Results.csv"
				};
				console.log("IN export_xlsx_js");
				$scope.gridOptions.api.exportDataAsCsv(params);
			}
/*
			this.export_xlsx_js= function(downloadStatus, current_database){ //excel 다운로드를 가능하게 할 부분
				var params={
					allColumns: true,
					fileName: "Genometrax_Search_Results.csv"
				};
				console.log("IN export_xlsx_js");
				$scope.gridOptions.api.exportDataAsCsv(params);
			} // 아니면 버튼을 분기하는것도? 괜찮을 것 같음
*/


	    //this.initialiizeAgGrid = function(_current_database, _genometrax_result_json_data, _genometrax_ontology_result_json_data)
			this.initialiizeAgGrid = function(_current_database, _genometrax_result_json_data, _genometrax_ontology_result_json_data, _filterOn) // filterOn=filter/nonFilter
	    {
	    	this.setColumnDefs(_current_database);
	    	this.setRawData(_current_database, _genometrax_result_json_data, _genometrax_ontology_result_json_data);
				//this.setRawData(_current_database, _genometrax_result_json_data, _genometrax_ontology_result_json_data, _fil);
	    }

	    this.setColumnDefs = function(_current_database)
	    {
	    	switch(_current_database)
	    	{
				case 1: /* Database 종류별로 나눈 것으로 확인 됨 */
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},// filter:'text'},//, filter: 'text'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},//, filter:'number'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},//, filter: 'number'},
									{headerName: "Type", field: "type", editable: true, width: 200},// filter: },
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 100},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Binding Factor", field: "bindingFactor", editable: true, width: 150},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Fragment End", field: "fragment_end", editable: true, width: 120},
									{headerName: "Fragment Start", field: "fragment_start", editable: true, width: 120},
									{headerName: "Matrix Id", field: "matrix_id", editable: true, width: 100},
									{headerName: "Matrix Score", field: "matrixScore", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
								];
				break;

	    		case 2:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 300},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "Binding Factor", field: "bindingFactor", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Site Acc", field: "siteAcc", editable: true, width: 100},
									{headerName: "Site Type", field: "site_type", editable: true, width: 100},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 3:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 150},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 150},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "Cpg Count", field: "cpgCount", editable: true, width: 120},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Gc Percent", field: "gcPercent", editable: true, width: 150},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 4:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 300},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pattern", field: "pattern", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
								];
				break;

				case 5:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 150},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

	    		case 6:
	    		case 29:
	    			columnDefs = [
	        						{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
	        						{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
	        						{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
        							{headerName: "Type", field: "type", editable: true, width: 300},
        							{headerName: "Genome", field: "genome", editable: true, width: 110},
	        						{headerName: "Strand", field: "strand", editable: true, width: 60},
	        						{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
       	    						{headerName: "Description", field: "description", editable: true, width: 530},
       	    						//{headerName: "Id", field: "id", editable: true, width: 100},
       	    						{headerName: "Accession", field: "accession", editable: true, width: 100},
       	    						{headerName: "Alt", field: "alt", editable: true, width: 100},
       	    						{headerName: "Aminoacid Change", field: "aminoacid_change", editable: true, width: 140},
       	    						{headerName: "Citation Type", field: "citation_type", editable: true, width: 100},
       	    						{headerName: "Codon Number", field: "codon_number", editable: true, width: 120},
       	    						{headerName: "Comments", field: "comments", editable: true, width: 250},
       	    						{headerName: "Confidence", field: "confidence", editable: true, width: 100},
       	    						{headerName: "Disease", field: "disease", editable: true, width: 480},
       	    						{headerName: "Ensembl", field: "ensembl", editable: true, width: 140},
       	    						{headerName: "Entrez", field: "entrez", editable: true, width: 100},
       	    						{headerName: "Genomic Sequence", field: "genomic_sequence", editable: true, width: 600},
       	    						{headerName: "Hgmd Acc", field: "hgmdAcc", editable: true, width: 100},
       	    						{headerName: "Hgvs", field: "hgvs", editable: true, width: 380},
       	    						{headerName: "Icd-10", field: "icd10", editable: true, width: 350},
       	    						{headerName: "Lsdb Source", field: "lsdb_source", editable: true, width: 100},
       	    						{headerName: "Mesh", field: "mesh", editable: true, width: 700},
       	    						{headerName: "Mutation Type", field: "mutationType", editable: true, width: 110},
       	    						{headerName: "Nucleotide Change", field: "nucleotideChange", editable: true, width: 170},
       	    						{headerName: "Omim", field: "omim", editable: true, width: 70},
       	    						{headerName: "Omim Ref", field: "omim_ref", editable: true, width: 540},
       	    						{headerName: "Pmid", field: "pmid", editable: true, width: 80},
       	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Pmid Notes", field: "pmid_notes", editable: true, width: 120},
       	    						{headerName: "Ref", field: "ref", editable: true, width: 550},
       	    						{headerName: "Rsid", field: "rsid", editable: true, width: 100},
       	    						{headerName: "Snomedct", field: "snomedct", editable: true, width: 100},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
       	    						{headerName: "Variant Type", field: "variantType", editable: true, width: 100},
    							];
    			break;

				case 9:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 150},
									{headerName: "Disease", field: "disease", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 180},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Disease Mesh Id", field: "disease_mesh_id", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 10:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pathway", field: "pathway", editable: true, width: 400},
									{headerName: "Pathway Acc", field: "pathway_acc", editable: true, width: 400},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 11:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "Drug", field: "drug", editable: true, width: 200},
									{headerName: "Drug Acc", field: "drug_acc", editable: true, width: 200},
									{headerName: "Drugbank", field: "drugbank", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 180},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 90},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Status", field: "status", editable: true, width: 390},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 12:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 250},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 300},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 110},
									{headerName: "Ptm Aminoacid", field: "ptm_aminoacid", editable: true, width: 180},
									{headerName: "Ptm Aminoacid Position", field: "ptm_aminoacidposition", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Ptm Modification", field: "ptm_modification", editable: true, width: 200},
									{headerName: "Ptm Molecule Acc", field: "ptm_moleculeAcc", editable: true, width: 180},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Ptm Source", field: "ptm_source", editable: true, width: 100},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

				case 15:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 300},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 300},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 150},
									{headerName: "Ada Pred", field: "ada_pred", editable: true, width: 180},
									{headerName: "Ada Score", field: "ada_score", editable: true, width: 180},
									{headerName: "Alt", field: "alt", editable: true, width: 60},
									{headerName: "Ensembl Functional Consequence", field: "ensembl_functional_consequence", editable: true, width: 250},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 300},
									{headerName: "Ensembl Region", field: "ensembl_region", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Ref", field: "ref", editable: true, width: 60},
									{headerName: "Refseq Functional Consequence", field: "refseq_functional_consequence", editable: true, width: 250},
									{headerName: "Refseq Gene", field: "refseq_gene", editable: true, width: 530},
									{headerName: "Refseq Region", field: "refseq_region", editable: true, width: 150},
									{headerName: "Rf Pred", field: "rf_pred", editable: true, width: 200},
									{headerName: "Rf Score", field: "rf_score", editable: true, width: 100},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
								];
				break;

    			case 17:
    				columnDefs = [
	        						{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
	        						{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
	        						{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
    				        		{headerName: "Type", field: "type", editable: true, width: 200},
	        						{headerName: "Genome", field: "genome", editable: true, width: 110},
	        						{headerName: "Strand", field: "strand", editable: true, width: 60},
	        						{headerName: "Hgnc", field: "hgnc", editable: true, width: 180},
       	    						{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field:"id", editable: true, width:200},
									{headerName: "Accession", field:"accession", editable: true, width:200},
									{headerName: "Alt", field:"alt", editable: true, width:200},
									{headerName: "Gwas 95pct CI", field:"gwas_95pct_CI", editable: true, width:220},
									{headerName: "Gwas CNV", field:"gwas_CNV", editable: true, width:200},
									{headerName: "Gwas Context", field:"gwas_context", editable: true, width:160},
									{headerName: "Gwas Disease", field:"gwas_disease", editable: true, width:250},
									{headerName: "Ensembl", field:"ensembl", editable: true, width:200},
									{headerName: "Entrez", field:"entrez", editable: true, width:200},
									{headerName: "Gwas Initial Sample Size", field:"gwas_initial_sample_size", editable: true, width:350},
									{headerName: "Gwas OR or Beta", field:"gwas_OR_or_beta", editable: true, width:200},
									{headerName: "Gwas P Value", field:"gwas_p_value", editable: true, width:200},
									{headerName: "Gwas P Value Context", field:"gwas_p_value_context", editable: true, width:200},
									{headerName: "Gwas Platform", field:"gwas_platform", editable: true, width:350},
									{headerName: "Pmid", field:"pmid", editable: true, width:100},
       	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Ref", field:"ref", editable: true, width:40},
									{headerName: "Gwas Region", field:"gwas_region", editable: true, width:150},
									{headerName: "Gwas Replication Sample Size", field:"gwas_replication_sample_size", editable: true, width:500},
									{headerName: "Gwas Reported Gene", field:"gwas_reported_gene", editable: true, width:200},
									{headerName: "Risk Allele", field:"risk_allele", editable: true, width:200},
									{headerName: "Gwas Risk Allele Frequency", field:"gwas_risk_allele_frequency", editable: true, width:200},
									{headerName: "Gwas Snps", field:"gwas_snps", editable: true, width:200},
									{headerName: "Uniprot", field:"uniprot", editable: true, width:200},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field:"hyperlink", editable: true, width:380},
    							];
    			break;

    			case 18:
    				columnDefs = [
	        						{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
	        						{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
	        						{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
    				        		{headerName: "Type", field: "type", editable: true, width: 200},
	        						{headerName: "Genome", field: "genome", editable: true, width: 110},
	        						{headerName: "Strand", field: "strand", editable: true, width: 60},
	        						{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
       	    						{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Confidence", field: "confidence", editable: true, width: 100},
									{headerName: "Disease", field: "disease", editable: true, width: 350},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 140},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Icd10", field: "icd10", editable: true, width: 300},
									{headerName: "Mesh", field: "mesh", editable: true, width: 300},
									{headerName: "MutationType", field: "mutationType", editable: true, width: 100},
									{headerName: "Omim Ref", field: "omim_ref", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
       	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Snomedct", field: "snomedct", editable: true, width: 100},
									{headerName: "Supporting Variants", field: "supporting_variants", editable: true, width: 200},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 100},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Variant Type", field: "variantType", editable: true, width: 100},
    				]
    			break;

				case 19:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 150},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 200},
									{headerName: "Derives From", field: "derives_from", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "Entrez", field: "entrez", editable: true, width: 200},
									{headerName: "Mature Form", field: "mature_form", editable: true, width: 200},
									{headerName: "Name", field: "name", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
								];
				break;

    			case 25:
	    			columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 200},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Evs AfricanAmericanAlleleCount", field: "evs_AfricanAmericanAlleleCount", editable: true, width: 250},
									{headerName: "Evs AfricanAmericanGenotypeCount", field: "evs_AfricanAmericanGenotypeCount", editable: true, width: 250},
									{headerName: "Evs AllAlleleCount", field: "evs_AllAlleleCount", editable: true, width: 200},
									{headerName: "Evs AllGenotypeCount", field: "evs_AllGenotypeCount", editable: true, width: 200},
									{headerName: "Evs Alleles", field: "evs_Alleles", editable: true, width: 100},
									{headerName: "Alt", field: "alt", editable: true, width: 60},
									{headerName: "Evs AvgSampleReadDepth", field: "evs_AvgSampleReadDepth", editable: true, width: 200},
									{headerName: "Evs cDNAPos", field: "evs_cDNAPos", editable: true, width: 200},
									{headerName: "Evs ChimpAllele", field: "evs_ChimpAllele", editable: true, width: 200},
									{headerName: "Evs ClinicalInfo", field: "evs_ClinicalInfo", editable: true, width: 200},
									{headerName: "Evs ConservationScorePhastCons", field: "evs_ConservationScorePhastCons", editable: true, width: 250},
									{headerName: "Evs dbSNPVersion", field: "evs_dbSNPVersion", editable: true, width: 200},
									{headerName: "ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "entrez", field: "entrez", editable: true, width: 200},
									{headerName: "Evs EuropeanAmericanAlleleCount", field: "evs_EuropeanAmericanAlleleCount", editable: true, width: 250},
									{headerName: "Evs EuropeanAmericanGenotypeCount", field: "evs_EuropeanAmericanGenotypeCount", editable: true, width: 300},
									{headerName: "Evs ConservationScoreGERP", field: "evs_ConservationScoreGERP", editable: true, width: 200},
									{headerName: "Evs FilterStatus", field: "evs_FilterStatus", editable: true, width: 200},
									{headerName: "Evs FunctionGVS", field: "evs_FunctionGVS", editable: true, width: 200},
									{headerName: "Evs GeneAccession", field: "evs_GeneAccession", editable: true, width: 200},
									{headerName: "Evs GranthamScore", field: "evs_GranthamScore", editable: true, width: 200},
									{headerName: "Evs Maf In Percent Aa", field: "evs_maf_in_percent_aa", editable: true, width: 200},
									{headerName: "Evs Maf In Percent All", field: "evs_maf_in_percent_all", editable: true, width: 200},
									{headerName: "Evs Maf In Percent Ea", field: "evs_maf_in_percent_ea", editable: true, width: 200},
									{headerName: "Evs_OnIlluminaHumanExomeChip", field: "evs_OnIlluminaHumanExomeChip", editable: true, width: 300},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
       	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Evs Polyphen", field: "evs_Polyphen", editable: true, width: 200},
									{headerName: "Evs ProteinPos", field: "evs_ProteinPos", editable: true, width: 200},
									{headerName: "Ref", field: "ref", editable: true, width: 100},
									{headerName: "Evs RefBaseNCBI37", field: "evs_RefBaseNCBI37", editable: true, width: 200},
									{headerName: "Rsid", field: "rsid", editable: true, width: 200},
									{headerName: "Evs Rsid Mapping", field: "evs_rsid_mapping", editable: true, width: 200},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 100},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
	    						];
	    		break;

	    		case 26:
	    			columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
	    				    		{headerName: "Type", field: "type", editable: true, width: 350},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 100},
									{headerName: "Description", field: "description", editable: true, width: 200},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "dbNSFP Aa Altref", field: "dbNSFP_aa_altref", editable: true, width: 200},
									{headerName: "dbNSFP Aa Pos", field: "dbNSFP_aa_pos", editable: true, width: 200},
									{headerName: "dbNSFP Aa Ref", field: "dbNSFP_aa_ref", editable: true, width: 200},
									{headerName: "Accession", field: "accession", editable: true, width: 200},
									{headerName: "Alt", field: "alt", editable: true, width: 60},
									{headerName: "dbNSFP Ancestral Allele", field: "dbNSFP_Ancestral_allele", editable: true, width: 200},
									{headerName: "dbNSFP Consensus Prediction", field: "dbNSFP_Consensus_Prediction", editable: true, width: 200},
									{headerName: "dbNSFP Eigen PC Raw", field: "dbNSFP_Eigen_pc_raw", editable: true, width: 200},
									{headerName: "dbNSFP Eigen Raw", field: "dbNSFP_Eigen_raw", editable: true, width: 200},
									//{headerName: "dbNSFP Cadd Score", field: "dbNSFP_cadd_score", editable: true, width: 200},
									//{headerName: "dbNSFP CCDSid", field: "dbNSFP_CCDSid", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 180},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "dbNSFP FATHMM Pred", field: "dbNSFP_FATHMM_pred", editable: true, width: 200},
									{headerName: "dbNSFP FATHMM Score", field: "dbNSFP_FATHMM_score", editable: true, width: 200},
									{headerName: "dbNSFP GenoCanyon Score", field: "dbNSFP_GenoCanyon_score", editable: true, width: 200},
									{headerName: "dbNSFP GERP NR", field: "dbNSFP_GERP_NR", editable: true, width: 200},
									{headerName: "dbNSFP GERP RS", field: "dbNSFP_GERP_RS", editable: true, width: 200},
									{headerName: "dbNSFP LRT Pred", field: "dbNSFP_LRT_pred", editable: true, width: 200},
									{headerName: "dbNSFP LRT Score", field: "dbNSFP_LRT_score", editable: true, width: 200},
									{headerName: "dbNSFP MetaLR Pred", field: "dbNSFP_metaLR_pred", editable: true, width: 200},
									{headerName: "dbNSFP MetaLR Score", field: "dbNSFP_metaLR_score", editable: true, width: 200},
									{headerName: "dbNSFP MetaSVM Pred", field: "dbNSFP_metaSVM_pred", editable: true, width: 200},
									{headerName: "dbNSFP MetaSVM Score", field: "dbNSFP_metaSVM_score", editable: true, width: 200},
									{headerName: "dbNSFP MutationAssessor Pred", field: "dbNSFP_MutationAssessor_pred", editable: true, width: 220},
									{headerName: "dbNSFP MutationAssessor Score", field: "dbNSFP_MutationAssessor_score", editable: true, width: 220},
									{headerName: "dbNSFP MutTaster Pred", field: "dbNSFP_MutTaster_pred", editable: true, width: 200},
									{headerName: "dbNSFP MutTaster Score", field: "dbNSFP_MutTaster_score", editable: true, width: 200},
									{headerName: "dbNSFP PhastCons100way Vertebrate", field: "dbNSFP_phastCons100way_vertebrate", editable: true, width: 250},
									{headerName: "dbNSFP PhastCons20way Mammaliane", field: "dbNSFP_phastCons20way_mammalian", editable: true, width: 250},
									//{headerName: "dbNSFP PhastCons46way Placental", field: "dbNSFP_phastCons46way_placental", editable: true, width: 250},
									//{headerName: "dbNSFP PhastCons46way Primate", field: "dbNSFP_phastCons46way_primate", editable: true, width: 250},
									{headerName: "dbNSFP PhyloP100way Vertebrate", field: "dbNSFP_phyloP100way_vertebrate", editable: true, width: 250},
									{headerName: "dbNSFP PhyloP20way Mammaliane", field: "dbNSFP_phyloP20way_mammalian", editable: true, width: 250},
									//{headerName: "dbNSFP PhyloP46way Placental", field: "dbNSFP_phyloP46way_placental", editable: true, width: 250},
									//{headerName: "dbNSFP PhyloP46way Primate", field: "dbNSFP_phyloP46way_primate", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
       	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "dbNSFP Protein", field: "dbNSFP_protein", editable: true, width: 100},
									//{headerName: "dbNSFP Polyphen2 Pred", field: "dbNSFP_Polyphen2_pred", editable: true, width: 200},
									//{headerName: "dbNSFP Polyphen2 Score", field: "dbNSFP_Polyphen2_score", editable: true, width: 200},
									{headerName: "dbNSFP PROVEAN Pred", field: "dbNSFP_PROVEAN_pred", editable: true, width: 200},
									{headerName: "dbNSFP PROVEAN Score", field: "dbNSFP_PROVEAN_score", editable: true, width: 200},
									{headerName: "Ref", field: "ref", editable: true, width: 200},
									{headerName: "dbNSFP Reliability Index", field: "dbNSFP_reliability_index", editable: true, width: 200},
									{headerName: "Rsid", field: "rsid", editable: true, width: 200},
									{headerName: "dbNSFP SIFT Pred", field: "dbNSFP_SIFT_pred", editable: true, width: 200},
									{headerName: "dbNSFP SIFT Score", field: "dbNSFP_SIFT_score", editable: true, width: 200},
									{headerName: "dbNSFP SiPhy 29way LogOdds", field: "dbNSFP_SiPhy_29way_logOdds", editable: true, width: 200},
									{headerName: "dbNSFP SiPhy 29way Pi", field: "dbNSFP_SiPhy_29way_pi", editable: true, width: 200},
									//{headerName: "dbNSFP SLR_test_statistic", field: "dbNSFP_SLR_test_statistic", editable: true, width: 200},
									{headerName: "dbNSFPTranscript", field: "dbNSFP_transcript", editable: true, width: 200},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 100},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "dbNSFP Variant", field: "dbNSFP_Variant", editable: true, width: 200},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 280},
	    						 ];
	    		break;

				case 30:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 350},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 400},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Dnase Css", field: "dnase_css", editable: true, width: 100},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 100},
									{headerName: "Fragment Acc", field: "fragmentAcc", editable: true, width: 200},
									{headerName: "Dnase Matrix Acc", field: "dnase_matrix_acc", editable: true, width: 150},
									{headerName: "Dnase Matrix Id", field: "dnase_matrix_id", editable: true, width: 150},
									{headerName: "Dnase Mss", field: "dnase_mss", editable: true, width: 100},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Dnase Sequence Site", field: "dnase_sequence_site", editable: true, width: 200},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
								];
				break;

    			case 32:
	    			columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
	    							{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 100},
									{headerName: "Description", field: "description", editable: true, width: 200},
									//{headerName: "Id", field:"id", editable: true, width:110},
									{headerName: "Clinvar Accession", field:"clinvar_Accession", editable: true, width:200},
									{headerName: "Clinvar AgeOfOnset", field:"clinvar_AgeOfOnset", editable: true, width:200},
									{headerName: "Allele_Id", field:"allele_id", editable: true, width:110},
									{headerName: "Alt", field:"alt", editable: true, width:60},
									{headerName: "Clinvar Clinical Significance", field:"clinvar_ClinicalSignificance", editable: true, width:250},
									{headerName: "Date Last Evaluated", field:"date_last_evaluated", editable: true, width:200},
									{headerName: "Clinvar Disease Name", field:"clinvar_DiseaseName", editable: true, width:250},
									{headerName: "Ensembl", field:"ensembl", editable: true, width:140},
									{headerName: "Entrez", field:"entrez", editable: true, width:100},
									{headerName: "Gene Reviews", field:"gene_reviews", editable: true, width:200},
									{headerName: "Guideline", field:"guideline", editable: true, width:200},
									{headerName: "Hgvs", field:"hgvs", editable: true, width:380},
									{headerName: "Measure Type", field:"measure_type", editable: true, width:200},
									{headerName: "Medgen", field:"medgen", editable: true, width:200},
									{headerName: "Clinvar Molecular Consequence", field:"clinvar_MolecularConsequence", editable: true, width:250},
									{headerName: "Number Submitters", field:"number_submitters", editable: true, width:200},
									{headerName: "Omim", field:"omim", editable: true, width:100},
									{headerName: "Clinvar Origin", field:"clinvar_Origin", editable: true, width:200},
									{headerName: "Orpha", field:"orpha", editable: true, width:200},
									{headerName: "Pmid", field:"pmid", editable: true, width:200},
      	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Clinvar Prevalence", field:"clinvar_Prevalence", editable: true, width:200},
									{headerName: "Ref", field:"ref", editable: true, width:100},
									{headerName: "Clinvar Review Status", field:"clinvar_ReviewStatus", editable: true, width:300},
									{headerName: "Rsid", field:"rsid", editable: true, width:150},
									{headerName: "Uniprot", field:"uniprot", editable: true, width:150},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field:"hyperlink", editable: true, width:400},
								];
				break;

				case 33:
					columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
	    							{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 100},
									{headerName: "Description", field: "description", editable: true, width: 150},
									//{headerName: "Id", field:"id", editable: true, width:110},
									{headerName: "Accession", field: "accession", editable: true, width: 120},
									{headerName: "DbSNP AlleleFreqCount", field: "DbSNP_alleleFreqCount", editable: true, width: 200},
									{headerName: "DbSNP AlleleFreqs", field: "DbSNP_alleleFreqs", editable: true, width: 200},
									{headerName: "DbSNP AlleleNs", field: "DbSNP_alleleNs", editable: true, width: 250},
									{headerName: "DbSNP Alleles", field: "DbSNP_alleles", editable: true, width: 150},
									{headerName: "DbSNP AvHet", field: "DbSNP_avHet", editable: true, width: 150},
									{headerName: "DbSNP AvHetSE", field: "DbSNP_avHetSE", editable: true, width: 150},
									{headerName: "DbSNP Bin", field: "DbSNP_bin", editable: true, width: 150},
									{headerName: "DbSNP Bitfields", field: "DbSNP_bitfields", editable: true, width: 150},
									{headerName: "DbSNP Class", field: "DbSNP_class", editable: true, width: 150},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 150},
									{headerName: "DbSNP Exceptions", field: "DbSNP_exceptions", editable: true, width: 150},
									{headerName: "DbSNP Func", field: "DbSNP_func", editable: true, width: 150},
									{headerName: "Hgmd", field: "hgmd", editable: true, width: 150},
									{headerName: "DbSNP LocType", field: "DbSNP_locType", editable: true, width: 150},
									{headerName: "DbSNP MAF", field: "DbSNP_MAF", editable: true, width: 150},
									{headerName: "DbSNP MolType", field: "DbSNP_molType", editable: true, width: 150},
									{headerName: "Pmid", field:"pmid", editable: true, width:150},
      	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "DbSNP RefNCBI", field: "DbSNP_refNCBI", editable: true, width: 150},
									{headerName: "DbSNP RefUCSC", field: "DbSNP_refUCSC", editable: true, width: 150},
									{headerName: "DbSNP Score", field: "DbSNP_score", editable: true, width: 150},
									{headerName: "DbSNP SubmitterCount", field: "DbSNP_submitterCount", editable: true, width: 200},
									{headerName: "DbSNP Submitters", field: "DbSNP_submitters", editable: true, width: 150},
									{headerName: "Uniprot", field:"uniprot", editable: true, width:150},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "DbSNP Valid", field: "DbSNP_valid", editable: true, width: 200},
									{headerName: "Variation", field: "variation", editable: true, width: 200},
									{headerName: "DbSNP Weight", field: "DbSNP_weight", editable: true, width: 200},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 400},
								];
				break;

    			case 34:
	    			columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 300},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 200},
									{headerName: "Description", field: "description", editable: true, width: 200},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 200},
									{headerName: "Pgmd Age", field: "pgmd_age", editable: true, width: 200},
									{headerName: "Amino Acid", field: "amino_acid", editable: true, width: 200},
									{headerName: "Pgmd Baseline Genotype Ind", field: "pgmd_baseline_genotype_ind", editable: true, width: 200},
									{headerName: "Pgmd Cases", field: "pgmd_cases", editable: true, width: 200},
									{headerName: "Pgmd Comments", field: "pgmd_comments", editable: true, width: 200},
									{headerName: "Pgmd Confidence Interval", field: "pgmd_confidence_interval", editable: true, width: 200},
									{headerName: "Pgmd Controls", field: "pgmd_controls", editable: true, width: 200},
									{headerName: "Disease", field: "disease", editable: true, width: 200},
									{headerName: "Disease Mesh Id", field: "disease_mesh_id", editable: true, width: 200},
									{headerName: "Drug", field: "drug", editable: true, width: 200},
									{headerName: "Pgmd Drug Mesh Id", field: "pgmd_drug_mesh_id", editable: true, width: 200},
									{headerName: "Drugbank Id", field: "drugbank_id", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 230},
									{headerName: "Entrez", field: "entrez", editable: true, width: 200},
									{headerName: "Pgmd Ethnicity", field: "pgmd_ethnicity", editable: true, width: 200},
									{headerName: "Pgmd Ethnicity Mesh Id", field: "pgmd_ethnicity_mesh_id", editable: true, width: 200},
									{headerName: "Pgmd Evidence", field: "pgmd_evidence", editable: true, width: 200},
									{headerName: "Pgmd Focus Disease", field: "pgmd_focus_disease", editable: true, width: 200},
									{headerName: "Pgmd Focus Drug", field: "pgmd_focus_drug", editable: true, width: 200},
									{headerName: "Pgmd Genetic Model", field: "pgmd_genetic_model", editable: true, width: 200},
									{headerName: "Pgmd Genotype", field: "pgmd_genotype", editable: true, width: 200},
									{headerName: "Pgmd Genotyping Source", field: "pgmd_genotyping_source", editable: true, width: 200},
									{headerName: "Pgmd Geography", field: "pgmd_geography", editable: true, width: 200},
									{headerName: "Pgmd Geography Mesh Id", field: "pgmd_geography_mesh_id", editable: true, width: 200},
									{headerName: "Pgmd Group Id", field: "pgmd_group_id", editable: true, width: 200},
									{headerName: "Pgmd Haplotype Id", field: "pgmd_haplotype_id", editable: true, width: 200},
									{headerName: "Pgmd Hazard Ratio", field: "pgmd_hazard_ratio", editable: true, width: 200},
									{headerName: "Pgmd Het Only Ind", field: "pgmd_het_only_ind", editable: true, width: 200},
									{headerName: "Pgmd Hgvs", field: "pgmd_hgvs", editable: true, width: 200},
									{headerName: "Pgmd Max Haplotype Matches", field: "pgmd_max_haplotype_matches", editable: true, width: 200},
									{headerName: "Pgmd Metabolizer", field: "pgmd_metabolizer", editable: true, width: 200},
									{headerName: "Pgmd Min Haplotype Matches", field: "pgmd_min_haplotype_matches", editable: true, width: 200},
									{headerName: "Pgmd Named Variation", field: "pgmd_named_variation", editable: true, width: 200},
									{headerName: "Pgmd Nearby Genes", field: "pgmd_nearby_genes", editable: true, width: 200},
									{headerName: "Pgmd Non Carrier Ind", field: "pgmd_non_carrier_ind", editable: true, width: 200},
									{headerName: "Pgmd Obsid", field: "pgmd_obsid", editable: true, width: 200},
									{headerName: "Pgmd Odds Ratio", field: "pgmd_odds_ratio", editable: true, width: 200},
									{headerName: "Pgmd P Value", field: "pgmd_p_value", editable: true, width: 200},
									{headerName: "Pgmd Phenotype", field: "pgmd_phenotype", editable: true, width: 200},
									{headerName: "Pgmd Phenotype Category", field: "pgmd_phenotype_category", editable: true, width: 200},
									{headerName: "Pgmd Phenotype Detail", field: "pgmd_phenotype_detail", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 200},
									{headerName: "Pubchem Cid", field: "pubchem_cid", editable: true, width: 200},
									{headerName: "Ref Id", field: "ref_id", editable: true, width: 200},
									{headerName: "Ref Type", field: "ref_type", editable: true, width: 200},
									{headerName: "Pgmd Reference Allele", field: "pgmd_reference_allele", editable: true, width: 200},
									{headerName: "Pgmd Registry Identifiers", field: "pgmd_registry_identifiers", editable: true, width: 200},
									{headerName: "Pgmd Relative Risk", field: "pgmd_relative_risk", editable: true, width: 200},
									{headerName: "Rsid", field: "rsid", editable: true, width: 200},
									{headerName: "Pgmd Sample Size", field: "pgmd_sample_size", editable: true, width: 200},
									{headerName: "Pgmd Sex", field: "pgmd_sex", editable: true, width: 200},
									{headerName: "Pgmd Site Genotype", field: "pgmd_site_genotype", editable: true, width: 200},
									{headerName: "Pgmd Study Design", field: "pgmd_study_design", editable: true, width: 200},
									{headerName: "Pgmd Treatment Detail", field: "pgmd_treatment_detail", editable: true, width: 200},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 200},
									{headerName: "Pgmd Variant Class", field: "pgmd_variant_class", editable: true, width: 200},
									{headerName: "Pgmd Variant Type", field: "pgmd_variant_type", editable: true, width: 200},
								];
				break;

	   			case 35:
    				columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
    					    		{headerName: "Type", field: "type", editable: true, width: 100},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 100},
									{headerName: "Description", field: "description", editable: true, width: 200},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 200},
									{headerName: "Omim Comments", field: "omim_comments", editable: true, width: 200},
									{headerName: "Omim Disorders", field: "omim_disorders", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "Entrez", field: "entrez", editable: true, width: 200},
									{headerName: "Omim Entry_date", field: "omim_entry_date", editable: true, width: 200},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 200},
									{headerName: "Omim Location", field: "omim_location", editable: true, width: 200},
									{headerName: "Omim Method", field: "omim_method", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
      	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 100},,
									{headerName: "Omim Status", field: "omim_status", editable: true, width: 150},
									{headerName: "Omim Title", field: "omim_title", editable: true, width: 300},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 200},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
					];
    			break;

				case 42:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 150},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 530},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 100},
									{headerName: "Avg Age Of Death", field: "avg_age_of_death", editable: true, width: 200},
									{headerName: "Avg Age Of Onset", field: "avg_age_of_onset", editable: true, width: 200},
									{headerName: "Disorder", field: "disorder", editable: true, width: 300},
									{headerName: "Disorder Type", field: "disorder_type", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 150},
									{headerName: "Entrez", field: "entrez", editable: true, width: 80},
									{headerName: "Orpha Inheritance", field: "orpha_inheritance", editable: true, width: 400},
									{headerName: "Omim Acc", field: "omim_acc", editable: true, width: 400},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Prevalence Class", field: "prevalence_class", editable: true, width: 250},
									{headerName: "Prevalence Geography", field: "prevalence_geography", editable: true, width: 250},
									{headerName: "Prevalence Qualification", field: "prevalence_qualification", editable: true, width: 200},
									{headerName: "Prevalence Source", field: "prevalence_source", editable: true, width: 250},
									{headerName: "Prevalence Type", field: "prevalence_type", editable: true, width: 250},
									{headerName: "Sign", field: "sign", editable: true, width: 300},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Valmoy", field: "valmoy", editable: true, width: 200},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 600},
								];
				break;

    			case 45:
					columnDefs= [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
									{headerName: "Type", field: "type", editable: true, width: 200},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 80},
									{headerName: "Description", field: "description", editable: true, width: 150},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 150},
									{headerName: "Alt", field: "alt", editable: true, width: 80},
									{headerName: "Denominator Count", field: "denominator_count", editable: true, width: 200},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "Entrez", field: "entrez", editable: true, width: 200},
									{headerName: "Frequency", field: "frequency", editable: true, width: 150},
									{headerName: "Numerator Count", field: "numerator_count", editable: true, width: 200},
									{headerName: "Pmid", field: "pmid", editable: true, width: 80},
									{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 380},
									{headerName: "Ref", field: "ref", editable: true, width: 60},
       	    						{headerName: "Uniprot", field: "uniprot", editable: true, width: 80},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
								];
				break;

    			case 59:
    				columnDefs = [
									{headerName: "Chromosome", field: "chromosome", editable: true, width: 110, pinned: 'left'},
									{headerName: "Feature Start", field: "feature_start", editable: true, width: 100, pinned: 'left'},
									{headerName: "Feature End", field: "feature_end", editable: true, width: 100, pinned: 'left'},
    				    			{headerName: "Type", field: "type", editable: true, width: 110},
									{headerName: "Genome", field: "genome", editable: true, width: 110},
									{headerName: "Strand", field: "strand", editable: true, width: 60},
									{headerName: "Hgnc", field: "hgnc", editable: true, width: 100},
									{headerName: "Description", field: "description", editable: true, width: 500},
									//{headerName: "Id", field: "id", editable: true, width: 100},
									{headerName: "Accession", field: "accession", editable: true, width: 110},
									{headerName: "Allele Count", field: "allele_count", editable: true, width: 150},
									{headerName: "Allele Frequency", field: "allele_frequency", editable: true, width: 150},
									{headerName: "Alt", field: "alt", editable: true, width: 60},
									{headerName: "Disease", field: "disease", editable: true, width: 500},
									{headerName: "Ensembl", field: "ensembl", editable: true, width: 200},
									{headerName: "Entrez", field: "entrez", editable: true, width: 150},
									{headerName: "No Of Samples", field: "no_of_samples", editable: true, width: 180},
									{headerName: "Pmid", field: "pmid", editable: true, width: 100},
      	    						{headerName: "Pmid Link", field: "pmid_link", editable: true, width: 100},
									{headerName: "Ref", field: "ref", editable: true, width: 70},
									{headerName: "Rsid", field: "rsid", editable: true, width: 100},
									{headerName: "Uniprot", field: "uniprot", editable: true, width: 100},
       	    						{headerName: "Uniprot Link", field: "uniprot_link", editable: true, width: 280},
									{headerName: "Variant Class", field: "variant_class", editable: true, width: 150},
									{headerName: "Variant Type", field: "variant_type", editable: true, width: 150},
									{headerName: "Hyperlink", field: "hyperlink", editable: true, width: 380},
    							];
    			break;
				default:
					console.log("[ Unexpected Database Number at setColumnDefs() ]")
	    	}
	    }

        this.setRawData = function(_current_database, _genometrax_result_json_data, _genometrax_ontology_result_json_data)
	    {
				console.log(_genometrax_result_json_data.length);
	    	for (var index=0; index < _genometrax_result_json_data.length; index++)
	    	{
		    	var singleRawObject = this.getSingleRawObject(_current_database, index, _genometrax_result_json_data, _genometrax_ontology_result_json_data);
 	    		rowData.push(singleRawObject)
	    	}
	    }

	    this.getSingleRawObject = function(_current_database, _index, _genometrax_result_json_data, _genometrax_ontology_result_json_data)
	    {
	    	singleRawObject = new Object();

	    	switch(_current_database)
	    	{
				case 1:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["bindingFactor"] = this.getDescriptionElement(/bindingFactor\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["fragment_end"] = this.getDescriptionElement(/fragment_end\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["fragment_start"] = this.getDescriptionElement(/fragment_start\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["matrix_id"] = this.getDescriptionElement(/matrix_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["matrixScore"] = this.getDescriptionElement(/matrixScore\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 2:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["bindingFactor"] = this.getDescriptionElement(/bindingFactor\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["siteAcc"] = this.getDescriptionElement(/siteAcc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["site_type"] = this.getDescriptionElement(/site_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 3:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["cpgCount"] = this.getDescriptionElement(/cpgCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gcPercent"] = this.getDescriptionElement(/gcPercent\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 4:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pattern"] = this.getDescriptionElement(/pattern\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 5:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

	    		case 6:
	    		case 29:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["aminoacid_change"] = this.getDescriptionElement(/aminoacid_change\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["citation_type"] = this.getDescriptionElement(/citation_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["codon_number"] = this.getDescriptionElement(/codon_number\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["comments"] = this.getDescriptionElement(/comments\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["confidence"] = this.getDescriptionElement(/confidence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease"] = this.getDescriptionElement(/disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["genomic_sequence"] = this.getDescriptionElement(/genomic_sequence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgmdAcc"] = this.getDescriptionElement(/hgmdAcc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgvs"] = this.getDescriptionElement(/hgvs\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["icd10"] = this.getDescriptionElement(/icd10\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["lsdb_source"] = this.getDescriptionElement(/lsdb_source\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["mesh"] = this.getDescriptionElement(/mesh\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["mutationType"] = this.getDescriptionElement(/mutationType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["nucleotideChange"] = this.getDescriptionElement(/nucleotideChange\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim"] = this.getDescriptionElement(/omim\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_ref"] = this.getDescriptionElement(/omim_ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["pmid_notes"] = this.getDescriptionElement(/pmid_notes\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] = this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["snomedct"] = this.getDescriptionElement(/snomedct\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["variantType"] = this.getDescriptionElement(/variantType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 9:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease"] = this.getDescriptionElement(/disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease_mesh_id"] = this.getDescriptionElement(/disease_mesh_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 10:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pathway"] = this.getDescriptionElement(/pathway\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pathway_acc"] = this.getDescriptionElement(/pathway_acc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 11:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["drug"] = this.getDescriptionElement(/drug\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["drug_acc"] = this.getDescriptionElement(/drug_acc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["drugbank"] = this.getDescriptionElement(/drugbank\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["status"] = this.getDescriptionElement(/status\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 12:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ptm_aminoacid"] = this.getDescriptionElement(/ptm_aminoacid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ptm_aminoacidposition"] = this.getDescriptionElement(/ptm_aminoacidposition\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ptm_modification"] = this.getDescriptionElement(/ptm_modification\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ptm_moleculeAcc"] = this.getDescriptionElement(/ptm_moleculeAcc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["ptm_source"] = this.getDescriptionElement(/ptm_source\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 15:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ada_pred"] = this.getDescriptionElement(/ada_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ada_score"] = this.getDescriptionElement(/ada_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl_functional_consequence"] = this.getDescriptionElement(/ensembl_functional_consequence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl_region"] = this.getDescriptionElement(/ensembl_region\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["refseq_functional_consequence"] = this.getDescriptionElement(/refseq_functional_consequence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["refseq_gene"] = this.getDescriptionElement(/refseq_gene\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["refseq_region"] = this.getDescriptionElement(/refseq_region\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rf_pred"] = this.getDescriptionElement(/rf_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rf_score"] = this.getDescriptionElement(/rf_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 17:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_95pct_CI"] = this.getDescriptionElement(/gwas_95pct_CI\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_CNV"] = this.getDescriptionElement(/gwas_CNV\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_context"] = this.getDescriptionElement(/gwas_context\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_disease"] = this.getDescriptionElement(/gwas_disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_initial_sample_size"] = this.getDescriptionElement(/gwas_initial_sample_size\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_OR_or_beta"] = this.getDescriptionElement(/gwas_OR_or_beta\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_p_value"] = this.getDescriptionElement(/gwas_p_value\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_p_value_context"] = this.getDescriptionElement(/gwas_p_value_context\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_platform"] = this.getDescriptionElement(/gwas_platform\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_region"] = this.getDescriptionElement(/gwas_region\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_replication_sample_size"] = this.getDescriptionElement(/gwas_replication_sample_size\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_reported_gene"] = this.getDescriptionElement(/gwas_reported_gene\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["risk_allele"] = this.getDescriptionElement(/risk_allele\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_risk_allele_frequency"] = this.getDescriptionElement(/gwas_risk_allele_frequency\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gwas_snps"] = this.getDescriptionElement(/gwas_snps\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 18:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["confidence"] = this.getDescriptionElement(/confidence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease"] = this.getDescriptionElement(/disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["icd10"] = this.getDescriptionElement(/icd10\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["mesh"] = this.getDescriptionElement(/mesh\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["mutationType"] = this.getDescriptionElement(/mutationType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_ref"] = this.getDescriptionElement(/omim_ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["snomedct"] = this.getDescriptionElement(/snomedct\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["supporting_variants"] = this.getDescriptionElement(/supporting_variants\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["variantType"] = this.getDescriptionElement(/variantType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 19:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["derives_from"] = this.getDescriptionElement(/derives_from\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["mature_form"] = this.getDescriptionElement(/mature_form\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["name"] = this.getDescriptionElement(/name\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 25:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_AfricanAmericanAlleleCount"] = this.getDescriptionElement(/evs_AfricanAmericanAlleleCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_AfricanAmericanGenotypeCount"] = this.getDescriptionElement(/evs_AfricanAmericanGenotypeCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_AllAlleleCount"] = this.getDescriptionElement(/evs_AllAlleleCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_AllGenotypeCount"] = this.getDescriptionElement(/evs_AllGenotypeCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_Alleles"] = this.getDescriptionElement(/evs_Alleles\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_AvgSampleReadDepth"] = this.getDescriptionElement(/evs_AvgSampleReadDepth\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_cDNAPos"] = this.getDescriptionElement(/evs_cDNAPos\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_ChimpAllele"] = this.getDescriptionElement(/evs_ChimpAllele\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_ClinicalInfo"] = this.getDescriptionElement(/evs_ClinicalInfo\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_ConservationScorePhastCons"] = this.getDescriptionElement(/evs_ConservationScorePhastCons\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_dbSNPVersion"] = this.getDescriptionElement(/evs_dbSNPVersion\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_EuropeanAmericanAlleleCount"] = this.getDescriptionElement(/evs_EuropeanAmericanAlleleCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_EuropeanAmericanGenotypeCount"] = this.getDescriptionElement(/evs_EuropeanAmericanGenotypeCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_ConservationScoreGERP"] = this.getDescriptionElement(/evs_ConservationScoreGERP\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_FilterStatus"] = this.getDescriptionElement(/evs_FilterStatus\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_FunctionGVS"] = this.getDescriptionElement(/evs_FunctionGVS\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_GeneAccession"] = this.getDescriptionElement(/evs_GeneAccession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_GranthamScore"] = this.getDescriptionElement(/evs_GranthamScore\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_maf_in_percent_aa"] = this.getDescriptionElement(/evs_maf_in_percent_aa\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_maf_in_percent_all"] = this.getDescriptionElement(/evs_maf_in_percent_all\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_maf_in_percent_ea"] = this.getDescriptionElement(/evs_maf_in_percent_ea\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_OnIlluminaHumanExomeChip"] = this.getDescriptionElement(/evs_OnIlluminaHumanExomeChip\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["evs_Polyphen"] = this.getDescriptionElement(/evs_Polyphen\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_ProteinPos"] = this.getDescriptionElement(/evs_ProteinPos\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_RefBaseNCBI37"] = this.getDescriptionElement(/evs_RefBaseNCBI37\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] = this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["evs_rsid_mapping"] = this.getDescriptionElement(/evs_rsid_mapping\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 26:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_aa_altref"] =this.getDescriptionElement(/dbNSFP_aa_altref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_aa_pos"] =this.getDescriptionElement(/dbNSFP_aa_pos\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_aa_ref"] =this.getDescriptionElement(/dbNSFP_aa_ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] =this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] =this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_Ancestral_allele"] =this.getDescriptionElement(/dbNSFP_Ancestral_allele\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_cadd_score"] =this.getDescriptionElement(/dbNSFP_cadd_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_CCDSid"] =this.getDescriptionElement(/dbNSFP_CCDSid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_Eigen_pc_raw"] =this.getDescriptionElement(/dbNSFP_Eigen_pc_raw\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					singleRawObject["dbNSFP_Eigen_raw"] =this.getDescriptionElement(/dbNSFP_Eigen_raw\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					singleRawObject["dbNSFP_Consensus_Prediction"] =this.getDescriptionElement(/dbNSFP_Consensus_Prediction\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] =this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] =this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_FATHMM_pred"] =this.getDescriptionElement(/dbNSFP_FATHMM_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_FATHMM_score"] =this.getDescriptionElement(/dbNSFP_FATHMM_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_GenoCanyon_score"] =this.getDescriptionElement(/GenoCanyon_score\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					singleRawObject["dbNSFP_GERP_NR"] =this.getDescriptionElement(/dbNSFP_GERP_NR\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_GERP_RS"] =this.getDescriptionElement(/dbNSFP_GERP_RS\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] =this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_LRT_pred"] =this.getDescriptionElement(/dbNSFP_LRT_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_LRT_score"] =this.getDescriptionElement(/dbNSFP_LRT_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_metaLR_pred"] =this.getDescriptionElement(/dbNSFP_metaLR_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_metaLR_score"] =this.getDescriptionElement(/dbNSFP_metaLR_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_metaSVM_pred"] =this.getDescriptionElement(/dbNSFP_metaSVM_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_metaSVM_score"] =this.getDescriptionElement(/dbNSFP_metaSVM_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_MutationAssessor_pred"] =this.getDescriptionElement(/dbNSFP_MutationAssessor_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_MutationAssessor_score"] =this.getDescriptionElement(/dbNSFP_MutationAssessor_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_MutTaster_pred"] =this.getDescriptionElement(/dbNSFP_MutTaster_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_MutTaster_score"] =this.getDescriptionElement(/dbNSFP_MutTaster_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_phastCons100way_vertebrate"] =this.getDescriptionElement(/dbNSFP_phastCons100way_vertebrate\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_phastCons20way_mammalian"] =this.getDescriptionElement(/dbNSFP_phastCons20way_mammalian\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					//singleRawObject["dbNSFP_phastCons46way_placental"] =this.getDescriptionElement(/dbNSFP_phastCons46way_placental\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_phastCons46way_primate"] =this.getDescriptionElement(/dbNSFP_phastCons46way_primate\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_phyloP100way_vertebrate"] =this.getDescriptionElement(/dbNSFP_phyloP100way_vertebrate\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_phyloP20way_mammalian"] =this.getDescriptionElement(/dbNSFP_phyloP20way_mammalian\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					//singleRawObject["dbNSFP_phyloP46way_placental"] =this.getDescriptionElement(/dbNSFP_phyloP46way_placental\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_phyloP46way_primate"] =this.getDescriptionElement(/dbNSFP_phyloP46way_primate\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["dbNSFP_protein"] =this.getDescriptionElement(/dbNSFP_protein\|(.*?);/, _genometrax_result_json_data[_index].description); // 16.04 추가
					//singleRawObject["dbNSFP_Polyphen2_pred"] =this.getDescriptionElement(/dbNSFP_Polyphen2_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_Polyphen2_score"] =this.getDescriptionElement(/dbNSFP_Polyphen2_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_PROVEAN_pred"] =this.getDescriptionElement(/dbNSFP_PROVEAN_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_PROVEAN_score"] =this.getDescriptionElement(/dbNSFP_PROVEAN_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref"] =this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_reliability_index"] =this.getDescriptionElement(/dbNSFP_reliability_index\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] =this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_SIFT_pred"] =this.getDescriptionElement(/dbNSFP_SIFT_pred\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_SIFT_score"] =this.getDescriptionElement(/dbNSFP_SIFT_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_SiPhy_29way_logOdds"] =this.getDescriptionElement(/dbNSFP_SiPhy_29way_logOdds\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_SiPhy_29way_pi"] =this.getDescriptionElement(/dbNSFP_SiPhy_29way_pi\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["dbNSFP_SLR_test_statistic"] =this.getDescriptionElement(/dbNSFP_SLR_test_statistic\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dbNSFP_transcript"] =this.getDescriptionElement(/dbNSFP_transcript\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["dbNSFP_Variant"] =this.getDescriptionElement(/dbNSFP_Variant\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] =this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 30:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dnase_css"] = this.getDescriptionElement(/dnase_css\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["fragmentAcc"] = this.getDescriptionElement(/fragmentAcc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dnase_matrix_acc"] = this.getDescriptionElement(/dnase_matrix_acc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dnase_matrix_id"] = this.getDescriptionElement(/dnase_matrix_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["dnase_mss"] = this.getDescriptionElement(/dnase_mss\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["dnase_sequence_site"] = this.getDescriptionElement(/dnase_sequence_site\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 32:
	    			singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] =  this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_Accession"] =  this.getDescriptionElement(/clinvar_Accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_AgeOfOnset"] =  this.getDescriptionElement(/clinvar_AgeOfOnset\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["allele_id"] =  this.getDescriptionElement(/allele_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] =  this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_ClinicalSignificance"] =  this.getDescriptionElement(/clinvar_ClinicalSignificance\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["date_last_evaluated"] =  this.getDescriptionElement(/date_last_evaluated\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_DiseaseName"] =  this.getDescriptionElement(/clinvar_DiseaseName\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] =  this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] =  this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["gene_reviews"] =  this.getDescriptionElement(/gene_reviews\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["guideline"] =  this.getDescriptionElement(/guideline\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] =  this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgvs"] =  this.getDescriptionElement(/hgvs\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["measure_type"] =  this.getDescriptionElement(/measure_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["medgen"] =  this.getDescriptionElement(/medgen\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_MolecularConsequence"] =  this.getDescriptionElement(/clinvar_MolecularConsequence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["number_submitters"] =  this.getDescriptionElement(/number_submitters\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim"] =  this.getDescriptionElement(/omim\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_Origin"] =  this.getDescriptionElement(/clinvar_Origin\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["orpha"] =  this.getDescriptionElement(/orpha\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] =  this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.	changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["clinvar_Prevalence"] =  this.getDescriptionElement(/clinvar_Prevalence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref"] =  this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["clinvar_ReviewStatus"] =  this.getDescriptionElement(/clinvar_ReviewStatus\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] =  this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] =  this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] =  this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] =  this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 33:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] =  this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					//singleRawObject["ID"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_alleleFreqCount"] = this.getDescriptionElement(/DbSNP_alleleFreqCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_alleleFreqs"] = this.getDescriptionElement(/DbSNP_alleleFreqs\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_alleleNs"] = this.getDescriptionElement(/DbSNP_alleleNs\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_alleles"] = this.getDescriptionElement(/DbSNP_alleles\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_avHet"] = this.getDescriptionElement(/DbSNP_avHet\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_avHetSE"] = this.getDescriptionElement(/DbSNP_avHetSE\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_bin"] = this.getDescriptionElement(/DbSNP_bin\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_bitfields"] = this.getDescriptionElement(/DbSNP_bitfields\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_class"] = this.getDescriptionElement(/DbSNP_class\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_exceptions"] = this.getDescriptionElement(/DbSNP_exceptions\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_func"] = this.getDescriptionElement(/DbSNP_func\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgmd"] = this.getDescriptionElement(/hgmd\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_locType"] = this.getDescriptionElement(/DbSNP_locType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_MAF"] = this.getDescriptionElement(/DbSNP_MAF\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_molType"] = this.getDescriptionElement(/DbSNP_molType\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] =  this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.	changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["DbSNP_refNCBI"] = this.getDescriptionElement(/DbSNP_refNCBI\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_refUCSC"] = this.getDescriptionElement(/DbSNP_refUCSC\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_score"] = this.getDescriptionElement(/DbSNP_score\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_submitterCount"] = this.getDescriptionElement(/DbSNP_submitterCount\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_submitters"] = this.getDescriptionElement(/DbSNP_submitters\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] =  this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["DbSNP_valid"] = this.getDescriptionElement(/DbSNP_valid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["variation"] = this.getDescriptionElement(/variation\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["DbSNP_weight"] = this.getDescriptionElement(/DbSNP_weight\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] =  this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 34:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_age"] = this.getDescriptionElement(/pgmd_age\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["amino_acid"] = this.getDescriptionElement(/amino_acid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_baseline_genotype_ind"] = this.getDescriptionElement(/pgmd_baseline_genotype_ind\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_cases"] = this.getDescriptionElement(/pgmd_cases\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_comments"] = this.getDescriptionElement(/pgmd_comments\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_confidence_interval"] = this.getDescriptionElement(/pgmd_confidence_interval\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_controls"] = this.getDescriptionElement(/pgmd_controls\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease"] = this.getDescriptionElement(/disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease_mesh_id"] = this.getDescriptionElement(/disease_mesh_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["drug"] = this.getDescriptionElement(/drug\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_drug_mesh_id"] = this.getDescriptionElement(/pgmd_drug_mesh_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["drugbank_id"] = this.getDescriptionElement(/drugbank_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_ethnicity"] = this.getDescriptionElement(/pgmd_ethnicity\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_ethnicity_mesh_id"] = this.getDescriptionElement(/pgmd_ethnicity_mesh_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_evidence"] = this.getDescriptionElement(/pgmd_evidence\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_focus_disease"] = this.getDescriptionElement(/pgmd_focus_disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_focus_drug"] = this.getDescriptionElement(/pgmd_focus_drug\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_genetic_model"] = this.getDescriptionElement(/pgmd_genetic_model\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_genotype"] = this.getDescriptionElement(/pgmd_genotype\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_genotyping_source"] = this.getDescriptionElement(/pgmd_genotyping_source\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_geography"] = this.getDescriptionElement(/pgmd_geography\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_geography_mesh_id"] = this.getDescriptionElement(/pgmd_geography_mesh_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_group_id"] = this.getDescriptionElement(/pgmd_group_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_haplotype_id"] = this.getDescriptionElement(/pgmd_haplotype_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_hazard_ratio"] = this.getDescriptionElement(/pgmd_hazard_ratio\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_het_only_ind"] = this.getDescriptionElement(/pgmd_het_only_ind\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_hgvs"] = this.getDescriptionElement(/pgmd_hgvs\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_max_haplotype_matches"] = this.getDescriptionElement(/pgmd_max_haplotype_matches\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_metabolizer"] = this.getDescriptionElement(/pgmd_metabolizer\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_min_haplotype_matches"] = this.getDescriptionElement(/pgmd_min_haplotype_matches\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_named_variation"] = this.getDescriptionElement(/pgmd_named_variation\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_nearby_genes"] = this.getDescriptionElement(/pgmd_nearby_genes\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_non_carrier_ind"] = this.getDescriptionElement(/pgmd_non_carrier_ind\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_obsid"] = this.getDescriptionElement(/pgmd_obsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_odds_ratio"] = this.getDescriptionElement(/pgmd_odds_ratio\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_p_value"] = this.getDescriptionElement(/pgmd_p_value\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_phenotype"] = this.getDescriptionElement(/pgmd_phenotype\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_phenotype_category"] = this.getDescriptionElement(/pgmd_phenotype_category\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_phenotype_detail"] = this.getDescriptionElement(/pgmd_phenotype_detail\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pubchem_cid"] = this.getDescriptionElement(/pubchem_cid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref_id"] = this.getDescriptionElement(/ref_id\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ref_type"] = this.getDescriptionElement(/ref_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_reference_allele"] = this.getDescriptionElement(/pgmd_reference_allele\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_registry_identifiers"] = this.getDescriptionElement(/pgmd_registry_identifiers\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_relative_risk"] = this.getDescriptionElement(/pgmd_relative_risk\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] = this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_sample_size"] = this.getDescriptionElement(/pgmd_sample_size\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_sex"] = this.getDescriptionElement(/pgmd_sex\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_site_genotype"] = this.getDescriptionElement(/pgmd_site_genotype\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_study_design"] = this.getDescriptionElement(/pgmd_study_design\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_treatment_detail"] = this.getDescriptionElement(/pgmd_treatment_detail\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_variant_class"] = this.getDescriptionElement(/pgmd_variant_class\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pgmd_variant_type"] = this.getDescriptionElement(/pgmd_variant_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					break;

				case 35:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_comments"] = this.getDescriptionElement(/omim_comments\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_disorders"] = this.getDescriptionElement(/omim_disorders\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_entry_date"] = this.getDescriptionElement(/omim_entry_date\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_location"] = this.getDescriptionElement(/omim_location\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_method"] = this.getDescriptionElement(/omim_method\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["omim_status"] = this.getDescriptionElement(/omim_status\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_title"] = this.getDescriptionElement(/omim_title\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				case 42:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["avg_age_of_death"] = this.getDescriptionElement(/avg_age_of_death\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["avg_age_of_onset"] = this.getDescriptionElement(/avg_age_of_onset\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disorder"] = this.getDescriptionElement(/disorder\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disorder_type"] = this.getDescriptionElement(/disorder_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["orpha_inheritance"] = this.getDescriptionElement(/orpha_inheritance\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["omim_acc"] = this.getDescriptionElement(/omim_acc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["prevalence_class"] = this.getDescriptionElement(/prevalence_class\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["prevalence_geography"] = this.getDescriptionElement(/prevalence_geography\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["prevalence_qualification"] = this.getDescriptionElement(/prevalence_qualification\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["prevalence_source"] = this.getDescriptionElement(/prevalence_source\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["prevalence_type"] = this.getDescriptionElement(/prevalence_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["sign"] = this.getDescriptionElement(/sign\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["valmoy"] = this.getDescriptionElement(/valmoy\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 45:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["denominator_count"] = this.getDescriptionElement(/denominator_count\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["frequency"] = this.getDescriptionElement(/frequency\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["numerator_count"] = this.getDescriptionElement(/numerator_count\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
				break;

				case 59:
					singleRawObject["type"] = this.getOntologyName(_genometrax_ontology_result_json_data, _genometrax_result_json_data[_index].ngs_ontology_no);
					singleRawObject["genome"] = _genometrax_result_json_data[_index].genome;
					singleRawObject["chromosome"] = _genometrax_result_json_data[_index].chromosome;
					singleRawObject["feature_start"] = _genometrax_result_json_data[_index].feature_start;
					singleRawObject["feature_end"] = _genometrax_result_json_data[_index].feature_end;
					singleRawObject["strand"] = _genometrax_result_json_data[_index].strand;
					//singleRawObject["id"] = this.getDescriptionElement(/ID\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["accession"] = this.getDescriptionElement(/accession\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["allele_count"] = this.getDescriptionElement(/allele_count\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["allele_frequency"] = this.getDescriptionElement(/allele_frequency\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["alt"] = this.getDescriptionElement(/alt\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["disease"] = this.getDescriptionElement(/disease\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["ensembl"] = this.getDescriptionElement(/ensembl\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["entrez"] = this.getDescriptionElement(/entrez\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hgnc"] = this.getDescriptionElement(/hgnc\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["no_of_samples"] = this.getDescriptionElement(/no_of_samples\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid"] = this.getDescriptionElement(/pmid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["pmid_link"] = this.changeArgumentsIntoUrl(singleRawObject["pmid"], "pmid_link");
					singleRawObject["ref"] = this.getDescriptionElement(/ref\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["rsid"] = this.getDescriptionElement(/rsid\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot"] = this.getDescriptionElement(/uniprot\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["uniprot_link"] = this.changeArgumentsIntoUrl(singleRawObject["uniprot"], "uniprot_link");
					singleRawObject["variant_class"] = this.getDescriptionElement(/variant_class\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["variant_type"] = this.getDescriptionElement(/variant_type\|(.*?);/, _genometrax_result_json_data[_index].description);
					singleRawObject["hyperlink"] = this.getDescriptionElement(/hyperlink\|(.*)/, _genometrax_result_json_data[_index].description);
					singleRawObject["description"] = this.getDescriptionElement(/feature\|(.*?);/, _genometrax_result_json_data[_index].description);
				break;

				default:
					console.log("[ Unexpected Database Number at getSingleRawObject() ]")
	    	}


	    	return singleRawObject;
	    }

	    this.setSearchOption = function(_searchOption) // 각자 submit 하는 부분이 이곳에 할당됨
	    {
	    	$scope.searchOption = _searchOption;
	    }

			//## 필터링 활성화를 위해 추가하는 부분
			this.SearchFilterOption = function(_searchOption, _filterOn)
	    {
				var this_form=null;
				//alert("SEARCH OPTION = "+_searchOption);
				if(_searchOption == "coordinates"){
					this_form=document.form_coordinates;
					this_form.method="post";
					this_form.action="/show_genometrax/coordinates/"+_filterOn;
					//this_form.action="/show_genometrax/coordinates";
					//this_form.ng-class="{coordinatesSearchInputTextArea:ServiceController.getCurrentInputStatus()==textInputStatus, coordinatesSearchInputTextFileArea:ServiceController.getCurrentInputStatus()==textFileInputStatus}"
					//this_form.ng-if="ServiceController.getCurrentInputStatus()!=initStatus"
					this_form.enctype="multipart/form-data";
					this_form.target="_blank";
				}else{ // form_genes
					//alert("ABC");
					this_form=document.form_genes;
					//alert(this_form);
					this_form.method="post";
					this_form.action="/show_genometrax/genes/"+_filterOn;
					//this_form.action="/show_genometrax/genes";
					this_form.enctype="multipart/form-data";
					this_form.target="_blank";
				}

				//alert(this_form.action+"");
				//alert(_filterOn);
	    	$scope.searchOption = _searchOption;
				$scope.filterOn=_filterOn;
				console.log("filterOn : "+_filterOn);

				this_form.submit();
	    }
			// 여기까지

	    this.getSearchOption = function()
	    {
	    	return $scope.searchOption;
	    }

	    this.setHgVersion = function(_hgVersion)
	    {
	    	$scope.hgVersion = _hgVersion;
	    }

	    this.getHgVersion = function()
	    {
	    	return $scope.hgVersion;
	    }

	    this.isHgVesion18 = function()
	    {
	    	if($scope.hgVersion=='hg18')
	    	{
	    		return true;
	    	}
	    	else
	    	{
	    		return false;
	    	}
	    }

	    this.isHgVesion19 = function()
	    {
	    	if($scope.hgVersion=='hg19')
	    	{
	    		return true;
	    	}
	    	else
	    	{
	    		return false;
	    	}
	    }

	    this.isHgVesion38 = function()
	    {
	    	if($scope.hgVersion=='hg38')
	    	{
	    		return true;
	    	}
	    	else
	    	{
	    		return false;
	    	}
	    }

	    this.setCurrentDatabase = function(_genometrax_ontology_result_json_data, _database_number)
	    {
	    	$scope.currentDatabaseName = this.getOntologyName(_genometrax_ontology_result_json_data, _database_number)
	    }

	    this.toggleDatabaseList = function()
	    {
	    	this.databaseListFlag = !(this.databaseListFlag);
	    }

	    this.getDatabaseListFlag = function()
	    {
	    	return this.databaseListFlag;
	    }

	    this.getDescriptionElement = function(_regex, _target)
	    {
	    	regex_result = _target.match(_regex);
	    	return decodeURIComponent(regex_result[1]);
	    }

	    this.getOntologyName = function(_genometrax_ontology_result_json_data, _genometrax_ontology_number)
	    {
	    	for(key in _genometrax_ontology_result_json_data)
	    	{
	    		if(parseInt(key) === _genometrax_ontology_number)
	    			return _genometrax_ontology_result_json_data[key];
	    	}
	    }

	    this.changeArgumentsIntoUrl = function(_target, _link_type)
	    {
	    	var tempString = "";
	    	var pubmedBasicUrl = "http://www.ncbi.nlm.nih.gov/pubmed/?term="
	    	var uniprotBasicUrl = "http://www.uniprot.org/uniprot/"

	    	splitTarget = _target.split(",");

	    	if(splitTarget[0]=='N/A')
	    	{
	    		return 'N/A'
	    	}

	    	if (_link_type == "pmid_link")
	    	{
	    		for ( index in splitTarget )
	    		{
		    		tempString += pubmedBasicUrl + splitTarget[index] + ", "
		    	}
	    	}
	    	else if (_link_type == "uniprot_link")
	    	{
	    		for ( index in splitTarget )
	    		{
		    		tempString += uniprotBasicUrl + splitTarget[index] + ", "
		    	}
		    }

	    	return tempString.slice(0,-2);
	    }

		this.setOptimizationPopUpFlag = function(_popUpFlag)
		{
			this.optimizationPopUpFlag = _popUpFlag;
	        $cookies.put('optimizationPopUpFlag', this.optimizationPopUpFlag);
		}

		this.getOptimizationPopUpFlag = function()
		{
			if (typeof this.optimizationPopUpFlagCookie == 'undefined')
			{
				return this.optimizationPopUpFlag;
			}
			else
			{
				return this.optimizationPopUpFlagCookie;
			}
		}

		this.setDownloadSettingPopUpFlag = function(_popUpFlag)
		{
			this.downloadSettingPopUpFlag = _popUpFlag;
	        $cookies.put('downloadSettingPopUpFlag', this.downloadSettingPopUpFlag);
		}

		this.getDownloadSettingPopUpFlag = function()
		{
			if (typeof this.downloadSettingPopUpFlagCookie == 'undefined')
			{
				return this.downloadSettingPopUpFlag;
			}
			else
			{
				return this.downloadSettingPopUpFlagCookie;
			}
		}

		this.setNoInputPopUpFlag = function(_popUpFlag)
		{
			this.noInputPopUpFlag = _popUpFlag;
		}

		this.getNoInputPopUpFlag = function()
		{
			return this.noInputPopUpFlag;
		}

		this.setRegionMaxmiumPopUpFlag = function(_popUpFlag)
		{
			this.regionMaxmiumPopUpFlag = _popUpFlag;
		}

		this.setRegionMaxmiumPopUpFlag_CloseTab = function(_popUpFlag)
		{
			this.regionMaxmiumPopUpFlag = _popUpFlag;
			window.close();
		}

		this.getRegionMaxmiumPopUpFlag = function()
		{
			return this.regionMaxmiumPopUpFlag;
		}

		this.setReversedRegionPopUpFlag = function(_popUpFlag)
		{
			this.reversedRegionPopUpFlag = _popUpFlag;
		}

		this.getReversedRegionPopUpFlag = function()
		{
			return this.reversedRegionPopUpFlag;
		}

		this.setNoDatabasePopUpFlag = function(_popUpFlag)
		{
			this.noDatabasePopUpFlag = _popUpFlag;
		}

		this.getNoDatabasePopUpFlag = function()
		{
			return this.noDatabasePopUpFlag;
		}

		this.setNoGenePopUpFlag = function(_popUpFlag)
		{
			this.noGenePopUpFlag = _popUpFlag;
		}

		this.getNoGenePopUpFlag = function()
		{
			return this.noGenePopUpFlag;
		}

		this.setPathwayPopUpFlag = function(_popUpFlag)
		{
			this.pathwayPopupFlag = _popUpFlag;
		}

		this.getPathwayPopUpFlag = function()
		{
			return this.pathwayPopupFlag;
		}

		this.setInputErrorPopupFlag = function(_popUpFlag)
		{
			this.inputErrorPopupFlag = _popUpFlag;
		}

		this.getInputErrorPopupFlag = function()
		{
			return this.inputErrorPopupFlag;
		}

		this.setGenePopUpFlag = function(_popUpFlag)
		{
			this.genePopUpFlag = _popUpFlag;
		}

		this.getGenePopUpFlag = function()
		{
			return this.genePopUpFlag;
		}

		this.setPopupText = function(_popUpText)
		{
			if(_popUpText == 'Optimization')
			{
				$scope.popUpText = $scope.optimizationPopUpText;
			}
			else if(_popUpText == 'DownloadSetting')
			{
				$scope.popUpText = $scope.downloadSettingPopUpText;
			}
		}

		this.getLoadingPopUpFlag = function()
		{
			return this.loadingFlag;
		}

		this.setLoadingPopupFlag = function(_popUpFlag)
		{
			this.loadingFlag = _popUpFlag;
		}

		this.selectPage = function(_tab)
		{
			this.tab = _tab;
		}

		this.isSelected = function(_tab)
		{
			return this.tab === _tab;
		}

		this.getInputFileListLength = function()
		{
			if($scope.input_file_list_length <= 1)
			{
				return false;
			}
			else
			{
				return true;
			}
		}

		this.getGenomtraxMoreExamplesPopUpFlag = function()
		{
			return this.genometraxMoreExamplesPopUpFlag;
		}

		this.setGenomtraxMoreExamplesPopUpFlag = function(_genometraxMoreExamplesPopUpFlag)
		{
			this.genometraxMoreExamplesPopUpFlag = _genometraxMoreExamplesPopUpFlag;
		}

		this.getKeggMoreExamplesPopUpFlag = function()
		{
			return this.keggMoreExamplesPopUpFlag;
		}

		this.setKeggMoreExamplesPopUpFlag = function(_keggMoreExamplesPopUpFlag)
		{
			this.keggMoreExamplesPopUpFlag = _keggMoreExamplesPopUpFlag;
		}


		this.getKeggExplanationPopUpFlag = function()
		{
			return this.keggExplanationPopUpFlag;
		}

		this.setKeggExplanationPopUpFlag = function(_keggExplanationPopUpFlag)
		{
			this.keggExplanationPopUpFlag = _keggExplanationPopUpFlag;
		}

		this.toggleDownloadStatus = function()
		{
			if($scope.downloadStatus=='all')
			{
				$scope.downloadStatus = 'current'
			}
			else if($scope.downloadStatus=='current')
			{
				$scope.downloadStatus = 'all'
			}
		}

		this.isDownloadStatusAll = function()
		{
			if($scope.downloadStatus=='all')
			{
				return true
			}
			else
			{
				return false
			}

		}

		this.isDownloadStatusCurrent = function()
		{
			if($scope.downloadStatus=='current')
			{
				return true
			}
			else
			{
				return false
			}

		}

		this.getDownloadStatus = function()
		{
			return $scope.downloadStatus
		}

		this.setDownloadStatus = function(_downloadStatus)
		{
			$scope.downloadStatus = _downloadStatus;
		}

 	    $scope.setMultipleFilesPlaceHolderValue = function (_element) {
    		$scope.$apply(function(scope) {
    	       	$scope.input_file_list_length = _element.files.length;
		       	$scope.multipleFilesPlaceHolderValue = $scope.input_file_list_length + " files";
		     });
    	}

	}]);

	app.controller("ServiceController", function($scope, $rootScope, Services) // constructor function
	{
		$scope.firstTabText = 'Input Type';
		$scope.secondTabText = 'DB Type';

		$scope.firstTabFlag = false;
		$scope.secondTabFlag = false;

		$scope.initStatus = 0;
		$scope.textInputStatus = 1;
		$scope.textFileInputStatus = 2;
		$scope.currentInputStatus = $scope.initStatus;

		$scope.placeHolderKeggText = 'Enter or paste at least three gene names and background colors here';
		$scope.coordinatesText = 'Enter or paste genomic coordinates here';
		$scope.genesText = 'Enter or paste genes here';
		$scope.keggTextPlaceHolderValue = $scope.placeHolderKeggText;
		$scope.coordinatesTextPlaceHolderValue = $scope.coordinatesText;
		$scope.genesTextPlaceHolderValue = $scope.genesText;
		$scope.textFilePlaceHolderValue = 'Choose a Text File';
		$scope.databaseList = {};
		$scope.fullDatabaseList = {"1":6,"2":29,"3":34,"4":32,"5":17,"6":25,"7":26,"8":33,"9":59,"10":45,"11":2,"12":1,"13":30,"14":3,"15":4,"16":5,"17":12,"18":19,"19":15,"20":9,"21":11,"22":10,"23":18,"24":42,"25":35};

		$scope.selectedTumorName = ""

    	$scope.setTextFilePlaceHolderValue = function (_element)
    	{
    		$scope.$apply(function(scope)
    		{
    	       	splitTextValue = _element.value.split('\\')
		       	$scope.textFilePlaceHolderValue = splitTextValue[splitTextValue.length-1];
		    });
    	}

		this.getCurrentInputStatus = function()
		{
			return $scope.currentInputStatus;
		}

		this.setCurrentInputStatus = function(_InputStatus)
		{
			$scope.currentInputStatus = _InputStatus;
		}

		this.clearKeggPlaceHolderValue = function()
		{
			$scope.keggTextPlaceHolderValue = '';
		}

		this.fillKeggPlaceHolderValue = function()
		{
			$scope.keggTextPlaceHolderValue = $scope.placeHolderKeggText;
		}

		this.clearCoordinatesPlaceHolderValue = function()
		{
			$scope.coordinatesTextPlaceHolderValue = '';
		}

		this.fillCoordinatesPlaceHolderValue = function()
		{
			$scope.coordinatesTextPlaceHolderValue = $scope.coordinatesText;
		}

		this.clearGenesPlaceHolderValue = function()
		{
			$scope.genesTextPlaceHolderValue = '';
		}

		this.fillGenesPlaceHolderValue = function()
		{
			$scope.genesTextPlaceHolderValue = $scope.genesText;
		}

		this.setInputTabText = function(_inputText)
		{
			$scope.firstTabText = _inputText;
			$scope.firstTabFlag = !($scope.firstTabFlag);

			if($scope.firstTabText=='List Text')
			{
				this.setCurrentInputStatus($scope.textInputStatus);
			}
			else if($scope.firstTabText=='List File')
			{
				this.setCurrentInputStatus($scope.textFileInputStatus);
			}
		}

		this.getInputTabFlag = function()
		{
			return $scope.firstTabFlag;
		}

		this.getInputTabText = function()
		{
			return $scope.firstTabText;
		}

		this.setDbTabText = function(_inputText)
		{
			$scope.secondTabText = _inputText;
			$scope.secondTabFlag = !($scope.secondTabFlag);

			$scope.textPlaceHolderValue = $scope.placeHolderKeggText;
		}

		this.getDbTabFlag = function()
		{
			return $scope.secondTabFlag;
		}

		this.getDbTabText = function()
		{
			return $scope.secondTabText;
		}

		this.selectDeselectAll = function()
		{
			if(JSON.stringify($scope.databaseList) != JSON.stringify($scope.fullDatabaseList)) // 전부 선택된 상태가 아니라면
			{
				$scope.databaseList = {"1":6,"2":29,"3":34,"4":32,"5":17,"6":25,"7":26,"8":33,"9":59,"10":45,"11":2,"12":1,"13":30,"14":3,"15":4,"16":5,"17":12,"18":19,"19":15,"20":9,"21":11,"22":10,"23":18,"24":42,"25":35};
			}
			else
			{
				$scope.databaseList = {};
			}
		}


		this.clickCheckBox = function(_index, _database_number)
		{
			if(!(_index in $scope.databaseList))
			{
				this.addToDatabaseList(_index, _database_number)
			}
			else if(_index in $scope.databaseList)
			{
				this.removeFromList(_index)
			}
		}

		this.isChecked = function(_index)
		{
			if(!(_index in $scope.databaseList))
			{
				return false
			}
			else if(_index in $scope.databaseList)
			{
				return true
			}
		}

		this.addToDatabaseList = function(_index, _database_number)
		{
			$scope.databaseList[_index] = _database_number;
		}

 		this.removeFromList = function(_index)
		{
			delete $scope.databaseList[_index];
		}

		this.getCheckedDatabaseListJSON = function()
		{
			return JSON.stringify($scope.databaseList);
		}

		this.isTumorSelected = function(_tumorName)
		{
			if($scope.selectedTumorName == _tumorName)
			{
				return true
			}
			else
			{
				return false
			}

		}

		this.selectTumorElement = function(_tumorName)
		{
			$scope.selectedTumorName = _tumorName
		}


		this.getTumorName = function()
		{
			return $scope.selectedTumorName
		}

	});

	app.controller("KeggResultController", ['$http' , function($scope, $http, $rootScope, Services)
	{
		$scope.downloadList = {};
		$scope.downloadListAll = {};
		$scope.selectAllFlag = false;

		this.initDownloadListAll = function(_index, _url)
		{
			$scope.downloadListAll[_index] = _url;
			str = JSON.stringify($scope.downloadListAll)
			console.log("$scope.downloadListAll >> " + str)
		}

		this.clickCheckBox = function(_index, _url)
		{
			if(!(_index in $scope.downloadList))
			{
				this.addToDownloadList(_index, _url)
			}
			else if(_index in $scope.downloadList)
			{
				this.removeFromDownloadList(_index)
			}
		}

		this.download = function()
		{
			for (var key in $scope.downloadList)
			{
			   	var link = document.createElement("a");
				link.download = "Test.png";
  				link.href = $scope.downloadList[key];
	  			link.click();
			}
		}

		this.setSelecteAllFlag = function()
		{
			this.toggleDownloadList();

			$scope.selectAllFlag = !($scope.selectAllFlag);
		}

		this.isChecked = function(_index)
		{
			if(!(_index in $scope.downloadList))
			{
				return false
			}
			else if(_index in $scope.downloadList)
			{
				return true
			}
		}

		this.addToDownloadList = function(_index, _url)
		{
			$scope.downloadList[_index] = _url;
			str = JSON.stringify($scope.downloadList)
		}

 		this.removeFromDownloadList = function(_index)
		{
			delete $scope.downloadList[_index];
			str = JSON.stringify($scope.downloadList)
		}

		this.getSelecteAllFlag = function()
		{
			return $scope.selectAllFlag;
		}


		this.toggleDownloadList = function()
		{
			if(this.getSelecteAllFlag()==false)
			{
				for (var key in $scope.downloadListAll)
				{
					this.addToDownloadList(key, $scope.downloadListAll[key])
				}
			}
			else if(this.getSelecteAllFlag()==true)
			{
				for (var key in $scope.downloadListAll)
				{
					this.removeFromDownloadList(key)
				}
			}
		}

	}]);

	app.animation(".test", function() {
		return {

			leave: function(element, done) {
				TweenLite.to(element, 0.5, { opacity: 0, onComplete: done })
			},
			enter: function(element, done) {
				TweenLite.from(element, 0.5, { opacity: 0, onComplete: done })
			}
		}
	})

})();
