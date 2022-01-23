#pragma once
String createJSON4WEB(String name, String fields[], const int *values )
{
    /*const unsigned int resolution_numbers[3][2] = {
        {1280, 720},
        {1920, 1080},
        {3840, 2160}
    };*/
    char* string = NULL;
    cJSON* data = NULL;
   

    cJSON* tempData = cJSON_CreateObject();

    if (cJSON_AddStringToObject(tempData, "name", name.c_str()) == NULL)
    {
        goto end;
    }

    data = cJSON_AddArrayToObject(tempData, "data");
    if (data == NULL)
    {
        goto end;
    }
    int totalFields = sizeof(fields) / sizeof(fields[0]);
    for (int row = 0; row < (sizeof(values) / (sizeof(int)*totalFields)); row++)
    {
        cJSON* arrayFields = cJSON_CreateObject();
        for (int field = 0; field < totalFields; field++) {
            if (cJSON_AddNumberToObject(arrayFields, fields[field].c_str(), values[row*totalFields+field]) == NULL)
            {
                goto end;
            }
        }
        cJSON_AddItemToArray(data, arrayFields);
    }

    string = cJSON_Print(tempData);
    if (string == NULL)
    {
        fprintf(stderr, "Failed to print monitor.\n");
    }

end:
    cJSON_Delete(tempData);
    return string;
}
